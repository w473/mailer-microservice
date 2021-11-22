import { MigrationInterface, QueryRunner } from 'typeorm';

export class update1637000303653 implements MigrationInterface {
  name = 'update1637000303653';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "email_templates_locales" ("id" SERIAL NOT NULL, "locale" character varying(8) NOT NULL, "subject" character varying NOT NULL, "contents" character varying NOT NULL, "template_id" integer NOT NULL, CONSTRAINT "UQ_bdde3566ba9264649430378fabd" UNIQUE ("locale", "template_id"), CONSTRAINT "PK_521fff57651746545912e9589eb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "email_templates" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_e832fef7d0d7dd4da2792eddbf7" UNIQUE ("name"), CONSTRAINT "PK_06c564c515d8cdb40b6f3bfbbb4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "emails" ("id" SERIAL NOT NULL, "subject" character varying(1024) NOT NULL, "contents" character varying NOT NULL, "sent" TIMESTAMP, "error" character varying, "template_id" integer NOT NULL, CONSTRAINT "PK_a54dcebef8d05dca7e839749571" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "emails_recipients" ("id" SERIAL NOT NULL, "user_id" uuid NOT NULL, "email_address" character varying(1024) NOT NULL, "name" character varying(1024) NOT NULL, "email_id" integer NOT NULL, CONSTRAINT "PK_9a6f88a87aa2a9893f6ef4ddd59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_templates_locales" ADD CONSTRAINT "FK_c61b6023e40c51af61ebc904f8d" FOREIGN KEY ("template_id") REFERENCES "email_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "emails" ADD CONSTRAINT "FK_36012b1c35262d9c66ebba40eb5" FOREIGN KEY ("template_id") REFERENCES "email_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "emails_recipients" ADD CONSTRAINT "FK_3b6f915c31a986a3e3e3d805bbc" FOREIGN KEY ("email_id") REFERENCES "emails"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "emails_recipients" DROP CONSTRAINT "FK_3b6f915c31a986a3e3e3d805bbc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "emails" DROP CONSTRAINT "FK_36012b1c35262d9c66ebba40eb5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_templates_locales" DROP CONSTRAINT "FK_c61b6023e40c51af61ebc904f8d"`,
    );
    await queryRunner.query(`DROP TABLE "emails_recipients"`);
    await queryRunner.query(`DROP TABLE "emails"`);
    await queryRunner.query(`DROP TABLE "email_templates"`);
    await queryRunner.query(`DROP TABLE "email_templates_locales"`);
  }
}
