import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { RemoteProcedureCallExceptionFilter } from '@app/@common/application/exceptions/filter';
import { ProductTypeORM } from '@app/@common/infrastructure/persistence/database/typeorm/entities/product.entity';

import { ProductFindOneUseCase } from '../use-cases';

@Controller()
@UseFilters(new RemoteProcedureCallExceptionFilter())
@UseInterceptors(ClassSerializerInterceptor)
export class ProductFindOneController {
  constructor(private readonly useCase: ProductFindOneUseCase) {}

  @MessagePattern('products.findone')
  async findOne(id: string): Promise<ProductTypeORM | undefined> {
    return this.useCase.execute(id);
  }
}
