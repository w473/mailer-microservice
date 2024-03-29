import { MigrationInterface, QueryRunner } from 'typeorm';

export class manualMigration1637000363205 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      INSERT INTO email_templates (id, name) VALUES (1, 'New user'),(2, 'User email changed activate');

      INSERT INTO email_templates_locales (locale, subject, contents, template_id) 
      VALUES
      ('en_US', 'Hello {{recipientName}}', 'Hi<br> please confirm you email by clicking <a href="{{activationURL}}">here</a>',
        (SELECT id FROM email_templates WHERE name='New user')),
      ('pl_PL', 'Witaj {{recipientName}}','Hej<br> potwierdź swój email klikając <a href="{{activationURL}}">tutaj</a>',
        (SELECT id FROM email_templates WHERE name='New user')),
      ('en_US', 'Email Activation','Hi<br> please confirm you email by clicking <a href="{{activationURL}}">here</a>',
        (SELECT id FROM email_templates WHERE name='User email changed activate')),
      ('pl_PL', 'Aktywacja email','Hej<br> potwierdź swój email klikając <a href="{{activationURL}}">tutaj</a>',
        (SELECT id FROM email_templates WHERE name='User email changed activate'));
 `,
    );
  }

  public async down(): Promise<void> {
    //Nothing to do
  }
}
