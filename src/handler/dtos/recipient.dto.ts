import { IsEmail, Length, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecipientDto {
  @ApiProperty()
  @IsUUID()
  userId?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(5, 256)
  name?: string;
}
