import { IsLocale, MinLength } from 'class-validator';
import { EmailTemplateLocaleEntity } from '../../infrastructure/db/entities/email-template-locale.entity';

export class EmailTemplateLocaleDto {
  @IsLocale()
  locale: string;

  @MinLength(5)
  subject: string;

  @MinLength(50)
  contents: string;
}

const fromEmailTemplateLocaleEntity = (
  emailTemplateLocaleEntity: EmailTemplateLocaleEntity,
): EmailTemplateLocaleDto => {
  return {
    subject: emailTemplateLocaleEntity.subject,
    contents: emailTemplateLocaleEntity.contents,
    locale: emailTemplateLocaleEntity.locale,
  };
};

export const fromEmailTemplateLocaleEntities = (
  emailTemplateLocaleEntities: EmailTemplateLocaleEntity[],
): EmailTemplateLocaleDto[] => {
  return emailTemplateLocaleEntities.map((emailTemplateLocaleEntity) => {
    return fromEmailTemplateLocaleEntity(emailTemplateLocaleEntity);
  });
};
