import {
  EmailTemplateLocaleDto,
  fromEmailTemplateLocaleEntities,
} from './email-template-locale.dto';
import { EmailTemplateEntity } from '../../infrastructure/db/entities/email-template.entity';
import { Length, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class EmailTemplateDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  @Length(5, 256)
  name?: string;

  @ApiProperty({ type: [EmailTemplateLocaleDto] })
  @ValidateNested()
  @Type(() => EmailTemplateLocaleDto)
  locales?: EmailTemplateLocaleDto[];
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
