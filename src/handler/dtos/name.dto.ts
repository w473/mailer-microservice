import { Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NameDto {
  @Length(5, 256)
  @ApiProperty()
  name?: string;
}
