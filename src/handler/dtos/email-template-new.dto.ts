import { EmailTemplateLocaleDto } from './email-template-locale.dto';
import { Length, ValidateNested, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class EmailTemplateNewDto {
  @ApiProperty()
  @Length(5, 256)
  name?: string;

  @ApiProperty({ type: [EmailTemplateLocaleDto] })
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => EmailTemplateLocaleDto)
  locales?: EmailTemplateLocaleDto[];
}
