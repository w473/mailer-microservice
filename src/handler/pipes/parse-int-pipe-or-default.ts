import {
  ParseIntPipe,
  ParseIntPipeOptions,
} from '@nestjs/common/pipes/parse-int.pipe';
import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface';

export class ParseIntPipeOrDefault extends ParseIntPipe {
  def: number | null;

  constructor(options?: ParseIntPipeOptions & { def: number }) {
    super(options);
    this.def = options?.def ?? null;
  }

  async transform(
    value: string,
    metadata: ArgumentMetadata,
  ): Promise<number | null> {
    if (!value || value.length === 0) {
      return this.def;
    }

    if (Number.isNaN(value)) {
      return this.def;
    }

    return super.transform(value, metadata);
  }
}
