import { IsLocale, Length, ValidateNested } from 'class-validator';

import { RecipientDto } from './recipient.dto';

export class EmailSendRequestDto {
  @Length(5, 256)
  templateName: string;

  @IsLocale()
  locale: string;

  @ValidateNested()
  recipient: RecipientDto;

  variables: Map<string, string>;
}
