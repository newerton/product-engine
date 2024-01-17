import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { RemoteProcedureCallExceptionFilter } from '@app/@common/application/exceptions/filter';

import { ProductFindAllControllerOutput } from '../dto';
import { ProductFindAllUseCase } from '../use-cases';

@Controller()
@UseFilters(new RemoteProcedureCallExceptionFilter())
@UseInterceptors(ClassSerializerInterceptor)
export class ProductFindAllController {
  constructor(private readonly useCase: ProductFindAllUseCase) {}

  @MessagePattern('products.findall')
  async findAll(
    @Payload('query') query,
  ): Promise<ProductFindAllControllerOutput> {
    const page = (query.page && Number(query.page)) || 1;
    const limit = 2;
    const offset = limit * (page - 1);
    const { items, total } = await this.useCase.execute({
      offset,
      limit,
    });

    return { items, total, page, limit };
  }
}
