import { MigrationInterface, QueryRunner } from "typeorm";

export class AddViewEntity1733059616987 implements MigrationInterface {
    name = 'AddViewEntity1733059616987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" RENAME COLUMN "views" TO "browsing"`);
        await queryRunner.query(`CREATE TABLE "views" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "car_id" uuid NOT NULL, CONSTRAINT "PK_ae7537f375649a618fff0fb2cb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "views" ADD CONSTRAINT "FK_8081f5698045410f5099bb0c56e" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "views" DROP CONSTRAINT "FK_8081f5698045410f5099bb0c56e"`);
        await queryRunner.query(`DROP TABLE "views"`);
        await queryRunner.query(`ALTER TABLE "cars" RENAME COLUMN "browsing" TO "views"`);
    }

}
