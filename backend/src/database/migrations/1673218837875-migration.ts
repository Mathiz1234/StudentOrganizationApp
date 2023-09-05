import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1673218837875 implements MigrationInterface {
    name = 'migration1673218837875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_function" DROP CONSTRAINT "FK_8783f2ae92cd0be95bbbcab8738"`);
        await queryRunner.query(`ALTER TABLE "account_functions_account_function" DROP CONSTRAINT "FK_ae7a2996c11bbc1efbd0e6e7ccb"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_204396792b4f3e47c2d1cbabdd" ON "account_function" ("year", "organizationFunctionId") `);
        await queryRunner.query(`ALTER TABLE "account_function" ADD CONSTRAINT "FK_8783f2ae92cd0be95bbbcab8738" FOREIGN KEY ("organizationFunctionId") REFERENCES "organization_function"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_functions_account_function" ADD CONSTRAINT "FK_ae7a2996c11bbc1efbd0e6e7ccb" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_functions_account_function" DROP CONSTRAINT "FK_ae7a2996c11bbc1efbd0e6e7ccb"`);
        await queryRunner.query(`ALTER TABLE "account_function" DROP CONSTRAINT "FK_8783f2ae92cd0be95bbbcab8738"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_204396792b4f3e47c2d1cbabdd"`);
        await queryRunner.query(`ALTER TABLE "account_functions_account_function" ADD CONSTRAINT "FK_ae7a2996c11bbc1efbd0e6e7ccb" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account_function" ADD CONSTRAINT "FK_8783f2ae92cd0be95bbbcab8738" FOREIGN KEY ("organizationFunctionId") REFERENCES "organization_function"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

}
