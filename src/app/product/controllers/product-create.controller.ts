import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { RemoteProcedureCallExceptionFilter } from '@app/@common/application/exceptions/filter';
import { ZodValidationPipe } from '@app/@common/application/pipes';

import { ProductCreateInput } from '../dto';
import { ProductCreateUseCase } from '../use-cases';
import { ProductCreateSchemaValidation } from '../validations';

@Controller()
@UseFilters(new RemoteProcedureCallExceptionFilter())
@UseInterceptors(ClassSerializerInterceptor)
export class ProductCreateController {
  constructor(private readonly useCase: ProductCreateUseCase) {}

  @MessagePattern('products.create')
  async create(
    @Payload(new ZodValidationPipe(new ProductCreateSchemaValidation()))
    payload: ProductCreateInput,
  ) {
    return this.useCase.execute(payload);
  }
}
