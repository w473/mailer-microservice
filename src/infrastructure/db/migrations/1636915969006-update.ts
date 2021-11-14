import {MigrationInterface, QueryRunner} from "typeorm";

export class update1636915969006 implements MigrationInterface {
    name = 'update1636915969006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_templates_locale" DROP CONSTRAINT "FK_cd37740dd05f638461e71b4efd1"`);
        await queryRunner.query(`ALTER TABLE "email_templates_locale" DROP CONSTRAINT "UQ_b0f4464399ac4dbced7aa3f3624"`);
        await queryRunner.query(`ALTER TABLE "email_templates_locale" ALTER COLUMN "template_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "email" DROP CONSTRAINT "FK_c90815fd4ca9119f19462207710"`);
        await queryRunner.query(`ALTER TABLE "email" ALTER COLUMN "template_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "email_recipient" DROP CONSTRAINT "FK_61d210494af8291cfe6a1cccc2d"`);
        await queryRunner.query(`ALTER TABLE "email_recipient" ALTER COLUMN "email_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "email_templates_locale" ADD CONSTRAINT "UQ_b0f4464399ac4dbced7aa3f3624" UNIQUE ("locale", "template_id")`);
        await queryRunner.query(`ALTER TABLE "email_templates_locale" ADD CONSTRAINT "FK_cd37740dd05f638461e71b4efd1" FOREIGN KEY ("template_id") REFERENCES "email_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email" ADD CONSTRAINT "FK_c90815fd4ca9119f19462207710" FOREIGN KEY ("template_id") REFERENCES "email_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_recipient" ADD CONSTRAINT "FK_61d210494af8291cfe6a1cccc2d" FOREIGN KEY ("email_id") REFERENCES "email"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_recipient" DROP CONSTRAINT "FK_61d210494af8291cfe6a1cccc2d"`);
        await queryRunner.query(`ALTER TABLE "email" DROP CONSTRAINT "FK_c90815fd4ca9119f19462207710"`);
        await queryRunner.query(`ALTER TABLE "email_templates_locale" DROP CONSTRAINT "FK_cd37740dd05f638461e71b4efd1"`);
        await queryRunner.query(`ALTER TABLE "email_templates_locale" DROP CONSTRAINT "UQ_b0f4464399ac4dbced7aa3f3624"`);
        await queryRunner.query(`ALTER TABLE "email_recipient" ALTER COLUMN "email_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "email_recipient" ADD CONSTRAINT "FK_61d210494af8291cfe6a1cccc2d" FOREIGN KEY ("email_id") REFERENCES "email"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email" ALTER COLUMN "template_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "email" ADD CONSTRAINT "FK_c90815fd4ca9119f19462207710" FOREIGN KEY ("template_id") REFERENCES "email_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_templates_locale" ALTER COLUMN "template_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "email_templates_locale" ADD CONSTRAINT "UQ_b0f4464399ac4dbced7aa3f3624" UNIQUE ("locale", "template_id")`);
        await queryRunner.query(`ALTER TABLE "email_templates_locale" ADD CONSTRAINT "FK_cd37740dd05f638461e71b4efd1" FOREIGN KEY ("template_id") REFERENCES "email_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
