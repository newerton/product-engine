import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { RemoteProcedureCallExceptionFilter } from '@app/@common/application/exceptions/filter/rpc-exception.filter';

import { ProductUpdateUseCase } from '../use-cases/product-update.use-case';

@Controller()
@UseFilters(new RemoteProcedureCallExceptionFilter())
@UseInterceptors(ClassSerializerInterceptor)
export class ProductUpdateController {
  constructor(private readonly useCase: ProductUpdateUseCase) {}

  @MessagePattern('products.update')
  update(): void {
    return this.useCase.execute();
  }
}
