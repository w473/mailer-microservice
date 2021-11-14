import { MigrationInterface, QueryRunner } from 'typeorm';

export class update1636914626243 implements MigrationInterface {
  name = 'update1636914626243';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email" ALTER COLUMN "sent" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "email" ALTER COLUMN "error" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email" ALTER COLUMN "error" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "email" ALTER COLUMN "sent" SET NOT NULL`,
    );
  }
}
