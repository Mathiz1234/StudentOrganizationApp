import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1670812821722 implements MigrationInterface {
    name = 'migration1670812821722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying(256) NOT NULL, "lastName" character varying(256) NOT NULL, "email" character varying(256) NOT NULL, "refreshTokenHash" character varying(64), "refreshTokenSalt" character varying(32) NOT NULL, "googleUserIdentifier" character varying, "createdById" uuid, "updatedById" uuid, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4c8f96ccf523e9a3faefd5bdd4" ON "account" ("email") `);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_781c791a345b169df8a1f04b5e7" FOREIGN KEY ("createdById") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_2d417231f8012b0d6f86ee9898c" FOREIGN KEY ("updatedById") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_2d417231f8012b0d6f86ee9898c"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_781c791a345b169df8a1f04b5e7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4c8f96ccf523e9a3faefd5bdd4"`);
        await queryRunner.query(`DROP TABLE "account"`);
    }

}
