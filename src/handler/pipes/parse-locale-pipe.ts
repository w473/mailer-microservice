import { PipeTransform } from '@nestjs/common/interfaces/features/pipe-transform.interface';
import { BadRequestException } from '@nestjs/common';
import { isLocale } from 'class-validator';

export class ParseLocalePipe implements PipeTransform<string> {
  async transform(value: string): Promise<string> {
    if (isLocale(value)) {
      return value;
    }
    throw new BadRequestException(
      'Validation failed (locale string is expected)',
    );
  }
}
