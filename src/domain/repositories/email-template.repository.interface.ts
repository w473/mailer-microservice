import { EmailTemplateEntity } from 'src/infrastructure/db/entities/email-template.entity';

export interface EmailTemplateRepositoryInterface {
  getTemplateByNameAndLocale(
    templateName: string,
    locale: string,
    fallBackLocale: string,
  ): Promise<EmailTemplateEntity>;
}
