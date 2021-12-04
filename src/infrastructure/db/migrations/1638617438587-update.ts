import { MigrationInterface, QueryRunner } from 'typeorm';

export class update1638617438587 implements MigrationInterface {
  name = 'update1638617438587';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "emails_recipients" ALTER COLUMN "user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "emails_recipients" ALTER COLUMN "name" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "emails_recipients" ALTER COLUMN "name" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "emails_recipients" ALTER COLUMN "user_id" SET NOT NULL`,
    );
  }
}
