import { Injectable } from '@nestjs/common';

import { Code } from '@core/@shared/domain/error/Code';
import { Exception } from '@core/@shared/domain/exception/Exception';

@Injectable()
export class ProductUpdateUseCase {
  execute(): void {
    throw Exception.new({
      code: Code.BAD_REQUEST.code,
      overrideMessage: 'Not implemented',
    });
  }
}
