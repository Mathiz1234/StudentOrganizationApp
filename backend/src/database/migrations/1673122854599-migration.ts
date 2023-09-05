import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1673122854599 implements MigrationInterface {
    name = 'migration1673122854599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "nick" text`);
        await queryRunner.query(`ALTER TABLE "account" ADD "birthday" date`);
        await queryRunner.query(`ALTER TABLE "account" ADD "joined" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "account" ADD "address" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "account" ADD "city" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "account" ADD "zipCode" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "account" ADD "phoneNumber" character varying(15)`);
        await queryRunner.query(`ALTER TABLE "account" ADD "faculty" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "account" ADD "fieldOfStudy" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "account" ADD "studyYear" integer`);
        await queryRunner.query(`ALTER TABLE "account" ADD "studyGroup" integer`);
        await queryRunner.query(`CREATE TYPE "public"."account_tshirtsize_enum" AS ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL')`);
        await queryRunner.query(`ALTER TABLE "account" ADD "tShirtSize" "public"."account_tshirtsize_enum" DEFAULT 'M'`);
        await queryRunner.query(`CREATE TYPE "public"."account_role_enum" AS ENUM('ADMIN', 'BOARD', 'USER')`);
        await queryRunner.query(`ALTER TABLE "account" ADD "role" "public"."account_role_enum" NOT NULL DEFAULT 'USER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."account_role_enum"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "tShirtSize"`);
        await queryRunner.query(`DROP TYPE "public"."account_tshirtsize_enum"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "studyGroup"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "studyYear"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "fieldOfStudy"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "faculty"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "zipCode"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "joined"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "birthday"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "nick"`);
    }

}
