import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFixes1732722103527 implements MigrationInterface {
    name = 'AddFixes1732722103527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "UQ_998e7e79ec945284ec8194d9a3b"`);
        await queryRunner.query(`ALTER TABLE "cars" ALTER COLUMN "rate" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" ALTER COLUMN "rate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "UQ_998e7e79ec945284ec8194d9a3b" UNIQUE ("model")`);
    }

}
