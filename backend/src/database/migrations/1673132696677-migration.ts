import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1673132696677 implements MigrationInterface {
    name = 'migration1673132696677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."account_status_enum" AS ENUM('BABY', 'MEMBER', 'FULL', 'ALUMN')`);
        await queryRunner.query(`ALTER TABLE "account" ADD "status" "public"."account_status_enum" NOT NULL DEFAULT 'BABY'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "tShirtSize" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "tShirtSize" SET DEFAULT 'M'`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."account_status_enum"`);
    }

}
