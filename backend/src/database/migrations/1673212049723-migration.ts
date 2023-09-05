import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1673212049723 implements MigrationInterface {
    name = 'migration1673212049723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(256) NOT NULL, "createdById" uuid, "updatedById" uuid, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_dedfea394088ed136ddadeee89" ON "project" ("name") `);
        await queryRunner.query(`CREATE TABLE "organization_function" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(256) NOT NULL, "projectId" uuid, "createdById" uuid, "updatedById" uuid, CONSTRAINT "PK_d41b29a012ca30adcc12b3d4c82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d3bad3152e4fda3abdc4947fe5" ON "organization_function" ("name", "projectId") `);
        await queryRunner.query(`CREATE TABLE "account_function" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "year" character varying(32) NOT NULL, "organizationFunctionId" uuid NOT NULL, "createdById" uuid, "updatedById" uuid, CONSTRAINT "PK_01204eb5ff128c736924a87e92a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plebiscite" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(256) NOT NULL, "createdById" uuid, "updatedById" uuid, CONSTRAINT "PK_1c82e94bedb81576d38d20a3aab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "training" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(256) NOT NULL, "createdById" uuid, "updatedById" uuid, CONSTRAINT "PK_c436c96be3adf1aa439ef471427" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account_functions_account_function" ("accountId" uuid NOT NULL, "accountFunctionId" uuid NOT NULL, CONSTRAINT "PK_de16dc06adbbd078f58724478cf" PRIMARY KEY ("accountId", "accountFunctionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ae7a2996c11bbc1efbd0e6e7cc" ON "account_functions_account_function" ("accountId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c28c92112a94ca88ec22cb231d" ON "account_functions_account_function" ("accountFunctionId") `);
        await queryRunner.query(`CREATE TABLE "account_trainings_training" ("accountId" uuid NOT NULL, "trainingId" uuid NOT NULL, CONSTRAINT "PK_03331c623c0067d761d386f1c80" PRIMARY KEY ("accountId", "trainingId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3e10866c03a8372569b94b0b61" ON "account_trainings_training" ("accountId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cc8d374b00e9e5b1e58dab4f30" ON "account_trainings_training" ("trainingId") `);
        await queryRunner.query(`CREATE TABLE "account_plebiscites_plebiscite" ("accountId" uuid NOT NULL, "plebisciteId" uuid NOT NULL, CONSTRAINT "PK_b7b7ebcd46dceaeb64b0b557b6e" PRIMARY KEY ("accountId", "plebisciteId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d7c88df9c7c44e4d69b9264918" ON "account_plebiscites_plebiscite" ("accountId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0f499d34533eac11db08a3ab57" ON "account_plebiscites_plebiscite" ("plebisciteId") `);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_678acfe7017fe8a25fe7cae5f18" FOREIGN KEY ("createdById") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_dfdad0cd83b31ccb2204f3dc688" FOREIGN KEY ("updatedById") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_function" ADD CONSTRAINT "FK_dc64e8309a701aea70ce2b9f8fd" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_function" ADD CONSTRAINT "FK_ca3524d1c25af96bbbd50560a2b" FOREIGN KEY ("createdById") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_function" ADD CONSTRAINT "FK_46a016b69efae48b0603ea67669" FOREIGN KEY ("updatedById") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_function" ADD CONSTRAINT "FK_8783f2ae92cd0be95bbbcab8738" FOREIGN KEY ("organizationFunctionId") REFERENCES "organization_function"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_function" ADD CONSTRAINT "FK_a0de2a7a9b6fa6d66c87f4c41ed" FOREIGN KEY ("createdById") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_function" ADD CONSTRAINT "FK_f4e5df1038b1087d2509e71f6b3" FOREIGN KEY ("updatedById") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plebiscite" ADD CONSTRAINT "FK_c998dd134565b9d8109d0b87b37" FOREIGN KEY ("createdById") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plebiscite" ADD CONSTRAINT "FK_3dd989025938d2695689c09d9aa" FOREIGN KEY ("updatedById") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training" ADD CONSTRAINT "FK_4a592020440944bd4abd9aff76e" FOREIGN KEY ("createdById") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training" ADD CONSTRAINT "FK_d61e19847660b3ea0f0cca01ffc" FOREIGN KEY ("updatedById") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_functions_account_function" ADD CONSTRAINT "FK_ae7a2996c11bbc1efbd0e6e7ccb" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account_functions_account_function" ADD CONSTRAINT "FK_c28c92112a94ca88ec22cb231d5" FOREIGN KEY ("accountFunctionId") REFERENCES "account_function"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account_trainings_training" ADD CONSTRAINT "FK_3e10866c03a8372569b94b0b616" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account_trainings_training" ADD CONSTRAINT "FK_cc8d374b00e9e5b1e58dab4f30d" FOREIGN KEY ("trainingId") REFERENCES "training"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account_plebiscites_plebiscite" ADD CONSTRAINT "FK_d7c88df9c7c44e4d69b92649189" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account_plebiscites_plebiscite" ADD CONSTRAINT "FK_0f499d34533eac11db08a3ab57b" FOREIGN KEY ("plebisciteId") REFERENCES "plebiscite"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_plebiscites_plebiscite" DROP CONSTRAINT "FK_0f499d34533eac11db08a3ab57b"`);
        await queryRunner.query(`ALTER TABLE "account_plebiscites_plebiscite" DROP CONSTRAINT "FK_d7c88df9c7c44e4d69b92649189"`);
        await queryRunner.query(`ALTER TABLE "account_trainings_training" DROP CONSTRAINT "FK_cc8d374b00e9e5b1e58dab4f30d"`);
        await queryRunner.query(`ALTER TABLE "account_trainings_training" DROP CONSTRAINT "FK_3e10866c03a8372569b94b0b616"`);
        await queryRunner.query(`ALTER TABLE "account_functions_account_function" DROP CONSTRAINT "FK_c28c92112a94ca88ec22cb231d5"`);
        await queryRunner.query(`ALTER TABLE "account_functions_account_function" DROP CONSTRAINT "FK_ae7a2996c11bbc1efbd0e6e7ccb"`);
        await queryRunner.query(`ALTER TABLE "training" DROP CONSTRAINT "FK_d61e19847660b3ea0f0cca01ffc"`);
        await queryRunner.query(`ALTER TABLE "training" DROP CONSTRAINT "FK_4a592020440944bd4abd9aff76e"`);
        await queryRunner.query(`ALTER TABLE "plebiscite" DROP CONSTRAINT "FK_3dd989025938d2695689c09d9aa"`);
        await queryRunner.query(`ALTER TABLE "plebiscite" DROP CONSTRAINT "FK_c998dd134565b9d8109d0b87b37"`);
        await queryRunner.query(`ALTER TABLE "account_function" DROP CONSTRAINT "FK_f4e5df1038b1087d2509e71f6b3"`);
        await queryRunner.query(`ALTER TABLE "account_function" DROP CONSTRAINT "FK_a0de2a7a9b6fa6d66c87f4c41ed"`);
        await queryRunner.query(`ALTER TABLE "account_function" DROP CONSTRAINT "FK_8783f2ae92cd0be95bbbcab8738"`);
        await queryRunner.query(`ALTER TABLE "organization_function" DROP CONSTRAINT "FK_46a016b69efae48b0603ea67669"`);
        await queryRunner.query(`ALTER TABLE "organization_function" DROP CONSTRAINT "FK_ca3524d1c25af96bbbd50560a2b"`);
        await queryRunner.query(`ALTER TABLE "organization_function" DROP CONSTRAINT "FK_dc64e8309a701aea70ce2b9f8fd"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_dfdad0cd83b31ccb2204f3dc688"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_678acfe7017fe8a25fe7cae5f18"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0f499d34533eac11db08a3ab57"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d7c88df9c7c44e4d69b9264918"`);
        await queryRunner.query(`DROP TABLE "account_plebiscites_plebiscite"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cc8d374b00e9e5b1e58dab4f30"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3e10866c03a8372569b94b0b61"`);
        await queryRunner.query(`DROP TABLE "account_trainings_training"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c28c92112a94ca88ec22cb231d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ae7a2996c11bbc1efbd0e6e7cc"`);
        await queryRunner.query(`DROP TABLE "account_functions_account_function"`);
        await queryRunner.query(`DROP TABLE "training"`);
        await queryRunner.query(`DROP TABLE "plebiscite"`);
        await queryRunner.query(`DROP TABLE "account_function"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d3bad3152e4fda3abdc4947fe5"`);
        await queryRunner.query(`DROP TABLE "organization_function"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dedfea394088ed136ddadeee89"`);
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
