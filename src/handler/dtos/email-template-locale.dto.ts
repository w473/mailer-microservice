import { IsLocale, MinLength } from 'class-validator';
import { EmailTemplateLocaleEntity } from '../../infrastructure/db/entities/email-template-locale.entity';
import { ApiProperty } from '@nestjs/swagger';

export class EmailTemplateLocaleDto {
  @IsLocale()
  @ApiProperty()
  locale: string;

  @MinLength(5)
  @ApiProperty()
  subject: string;

  @MinLength(50)
  @ApiProperty()
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
