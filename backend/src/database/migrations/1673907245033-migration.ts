import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1673907245033 implements MigrationInterface {
    name = 'migration1673907245033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_trainings_training" DROP CONSTRAINT "FK_cc8d374b00e9e5b1e58dab4f30d"`);
        await queryRunner.query(`CREATE TYPE "public"."deadline_type_enum" AS ENUM('FEEDBACK', 'CALL')`);
        await queryRunner.query(`CREATE TABLE "deadline" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "description" text NOT NULL, "ddl" TIMESTAMP NOT NULL, "type" "public"."deadline_type_enum" NOT NULL, "projectId" uuid, "createdById" uuid, "updatedById" uuid, CONSTRAINT "PK_9b68db28fc035ed8a84691bfbaf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "deadline" ADD CONSTRAINT "FK_c3b4289565269dcc4133a967ab9" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deadline" ADD CONSTRAINT "FK_627b8392f7091b426f8c48f2d05" FOREIGN KEY ("createdById") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deadline" ADD CONSTRAINT "FK_7fde1f841026a1d1fbda0c1cd6e" FOREIGN KEY ("updatedById") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_trainings_training" ADD CONSTRAINT "FK_cc8d374b00e9e5b1e58dab4f30d" FOREIGN KEY ("trainingId") REFERENCES "training"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_trainings_training" DROP CONSTRAINT "FK_cc8d374b00e9e5b1e58dab4f30d"`);
        await queryRunner.query(`ALTER TABLE "deadline" DROP CONSTRAINT "FK_7fde1f841026a1d1fbda0c1cd6e"`);
        await queryRunner.query(`ALTER TABLE "deadline" DROP CONSTRAINT "FK_627b8392f7091b426f8c48f2d05"`);
        await queryRunner.query(`ALTER TABLE "deadline" DROP CONSTRAINT "FK_c3b4289565269dcc4133a967ab9"`);
        await queryRunner.query(`DROP TABLE "deadline"`);
        await queryRunner.query(`DROP TYPE "public"."deadline_type_enum"`);
        await queryRunner.query(`ALTER TABLE "account_trainings_training" ADD CONSTRAINT "FK_cc8d374b00e9e5b1e58dab4f30d" FOREIGN KEY ("trainingId") REFERENCES "training"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
