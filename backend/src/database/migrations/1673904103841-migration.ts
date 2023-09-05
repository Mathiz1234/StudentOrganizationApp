import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1673904103841 implements MigrationInterface {
    name = 'migration1673904103841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_trainings_training" DROP CONSTRAINT "FK_3e10866c03a8372569b94b0b616"`);
        await queryRunner.query(`ALTER TABLE "account_trainings_training" ADD CONSTRAINT "FK_3e10866c03a8372569b94b0b616" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_trainings_training" DROP CONSTRAINT "FK_3e10866c03a8372569b94b0b616"`);
        await queryRunner.query(`ALTER TABLE "account_trainings_training" ADD CONSTRAINT "FK_3e10866c03a8372569b94b0b616" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
