import { EmailTemplateEntity } from 'src/infrastructure/db/entities/email-template.entity';

export interface EmailTemplateRepositoryInterface {
  getTemplateByNameAndLocale(
    templateName: string,
    locale: string,
    fallBackLocale: string,
  ): Promise<EmailTemplateEntity>;

  findAndCount({
    where,
    limit,
    page,
  }: {
    where: any;
    limit: number;
    page: number;
  }): Promise<[EmailTemplateEntity[], number]>;

  findOne(templateId: number): Promise<EmailTemplateEntity>;

  save(emailTemplateEntity: EmailTemplateEntity): Promise<EmailTemplateEntity>;

  remove(emailTemplateEntity: EmailTemplateEntity): Promise<void>;
}
