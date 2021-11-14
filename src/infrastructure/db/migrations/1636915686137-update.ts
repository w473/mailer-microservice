import {MigrationInterface, QueryRunner} from "typeorm";

export class update1636915686137 implements MigrationInterface {
    name = 'update1636915686137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_recipient" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "email_recipient" ADD "name" character varying(1024) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_recipient" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "email_recipient" ADD "name" character varying(8) NOT NULL`);
    }

}
