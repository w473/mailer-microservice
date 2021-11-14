import { MigrationInterface, QueryRunner } from 'typeorm';

export class update1636902908326 implements MigrationInterface {
  name = 'update1636902908326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "email_templates_locale" ("id" SERIAL NOT NULL, "locale" character varying(8) NOT NULL, "subject" character varying NOT NULL, "contents" character varying NOT NULL, "template_id" integer, CONSTRAINT "UQ_b0f4464399ac4dbced7aa3f3624" UNIQUE ("locale", "template_id"), CONSTRAINT "PK_82e0495b0ca4390769269bd0245" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "email_templates" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_e832fef7d0d7dd4da2792eddbf7" UNIQUE ("name"), CONSTRAINT "PK_06c564c515d8cdb40b6f3bfbbb4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "email" ("id" SERIAL NOT NULL, "subject" character varying(1024) NOT NULL, "contents" character varying NOT NULL, "sent" TIMESTAMP NOT NULL, "error" character varying NOT NULL, "template_id" integer, CONSTRAINT "PK_1e7ed8734ee054ef18002e29b1c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "email_recipient" ("id" SERIAL NOT NULL, "user_id" uuid NOT NULL, "email" character varying(1024) NOT NULL, "name" character varying(8) NOT NULL, "mail_id" integer, CONSTRAINT "PK_897939e90d3bcdaaa3809451b13" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_templates_locale" ADD CONSTRAINT "FK_cd37740dd05f638461e71b4efd1" FOREIGN KEY ("template_id") REFERENCES "email_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email" ADD CONSTRAINT "FK_c90815fd4ca9119f19462207710" FOREIGN KEY ("template_id") REFERENCES "email_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_recipient" ADD CONSTRAINT "FK_f29475d3632ef3887efa5f9b4c8" FOREIGN KEY ("mail_id") REFERENCES "email"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_recipient" DROP CONSTRAINT "FK_f29475d3632ef3887efa5f9b4c8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email" DROP CONSTRAINT "FK_c90815fd4ca9119f19462207710"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_templates_locale" DROP CONSTRAINT "FK_cd37740dd05f638461e71b4efd1"`,
    );
    await queryRunner.query(`DROP TABLE "email_recipient"`);
    await queryRunner.query(`DROP TABLE "email"`);
    await queryRunner.query(`DROP TABLE "email_templates"`);
    await queryRunner.query(`DROP TABLE "email_templates_locale"`);
  }
}
