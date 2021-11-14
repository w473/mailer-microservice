import { IsLocale, IsString, Length, ValidateNested } from 'class-validator';

import { RecipientDto } from './recipient.dto';
import { ApiProperty } from '@nestjs/swagger';

export class EmailSendRequestDto {
  @Length(5, 256)
  @IsString()
  @ApiProperty()
  templateName: string;

  @IsLocale()
  @ApiProperty()
  locale: string;

  @ValidateNested()
  @ApiProperty()
  recipient: RecipientDto;

  @ApiProperty()
  variables: Record<string, string>;
}
