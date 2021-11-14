import {MigrationInterface, QueryRunner} from "typeorm";

export class update1636915015571 implements MigrationInterface {
    name = 'update1636915015571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_recipient" DROP CONSTRAINT "FK_f29475d3632ef3887efa5f9b4c8"`);
        await queryRunner.query(`ALTER TABLE "email_recipient" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "email_recipient" DROP COLUMN "mail_id"`);
        await queryRunner.query(`ALTER TABLE "email_recipient" ADD "email_address" character varying(1024) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "email_recipient" ADD "email_id" integer`);
        await queryRunner.query(`ALTER TABLE "email_recipient" ADD CONSTRAINT "FK_61d210494af8291cfe6a1cccc2d" FOREIGN KEY ("email_id") REFERENCES "email"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_recipient" DROP CONSTRAINT "FK_61d210494af8291cfe6a1cccc2d"`);
        await queryRunner.query(`ALTER TABLE "email_recipient" DROP COLUMN "email_id"`);
        await queryRunner.query(`ALTER TABLE "email_recipient" DROP COLUMN "email_address"`);
        await queryRunner.query(`ALTER TABLE "email_recipient" ADD "mail_id" integer`);
        await queryRunner.query(`ALTER TABLE "email_recipient" ADD "email" character varying(1024) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "email_recipient" ADD CONSTRAINT "FK_f29475d3632ef3887efa5f9b4c8" FOREIGN KEY ("mail_id") REFERENCES "email"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
