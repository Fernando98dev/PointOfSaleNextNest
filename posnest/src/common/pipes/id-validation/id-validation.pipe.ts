import { ArgumentMetadata, Injectable, ParseIntPipe, PipeTransform } from '@nestjs/common';

@Injectable()
export class IdValidationPipe extends ParseIntPipe {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
