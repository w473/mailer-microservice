import { fromEmailTemplateLocaleEntities } from './email-template-locale.dto';
import { EmailTemplateEntity } from '../../infrastructure/db/entities/email-template.entity';
import { ApiProperty } from '@nestjs/swagger';
import { EmailTemplateNewDto } from 'src/handler/dtos/email-template-new.dto';

export class EmailTemplateDto extends EmailTemplateNewDto {
  @ApiProperty()
  id?: number;
}

export const fromEmailTemplateEntity = (
  emailTemplateEntity: EmailTemplateEntity,
): EmailTemplateDto => {
  return {
    id: emailTemplateEntity.id,
    name: emailTemplateEntity.name,
    locales: fromEmailTemplateLocaleEntities(emailTemplateEntity.locales),
  };
};

export const fromEmailTemplateEntities = (
  emailTemplateEntities: EmailTemplateEntity[],
): EmailTemplateDto[] => {
  return emailTemplateEntities.map((emailTemplateEntity) => {
    return fromEmailTemplateEntity(emailTemplateEntity);
  });
};
