import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { RemoteProcedureCallExceptionFilter } from '@app/@common/application/exceptions/filter/rpc-exception.filter';
import { JoiValidationPipe } from '@app/@common/application/pipes/joi-validation.pipe';
import { ProductCreateInput } from '@app/dto/product-create.dto';

import { ProductCreateUseCase } from '../use-cases/product-create.use-case';
import { ProductCreateSchemaValidation } from '../validations/product-create.schema.validation';

@Controller()
@UseFilters(new RemoteProcedureCallExceptionFilter())
@UseInterceptors(ClassSerializerInterceptor)
export class ProductCreateController {
  constructor(private readonly useCase: ProductCreateUseCase) {}

  @MessagePattern('products.create')
  async create(
    @Payload(new JoiValidationPipe(new ProductCreateSchemaValidation()))
    payload: ProductCreateInput,
  ): Promise<void> {
    return this.useCase.execute(payload);
  }
}
