import { IsEmail, Length, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecipientDto {
  @IsUUID()
  @ApiProperty()
  userId: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @Length(5, 256)
  @ApiProperty()
  name: string;
}
