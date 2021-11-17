import { IsLocale, IsString, Length, ValidateNested } from 'class-validator';

import { RecipientDto } from './recipient.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { VariablesDto } from 'src/handler/dtos/variables.dto';

export class EmailSendRequestDto {
  @Length(5, 256)
  @IsString()
  @ApiProperty()
  templateName: string;

  @IsLocale()
  @ApiProperty()
  locale: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => RecipientDto)
  recipient: RecipientDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => VariablesDto)
  variables: Record<string, string>;
}
