import { EmailTemplateLocaleEntity } from 'src/infrastructure/db/entities/email-template-locale.entity';

export interface EmailTemplateLocaleRepositoryInterface {
  save(
    emailTemplateLocaleEntity: EmailTemplateLocaleEntity,
  ): Promise<EmailTemplateLocaleEntity>;

  remove(emailTemplateLocaleEntity: EmailTemplateLocaleEntity): Promise<void>;
}
