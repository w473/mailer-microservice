import { Length } from 'class-validator';

export class NameDto {
  @Length(5, 256)
  name?: string;
}
