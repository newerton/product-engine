import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { RemoteProcedureCallExceptionFilter } from '@app/@common/application/exceptions/filter';
import { ZodValidationPipe } from '@app/@common/application/pipes';
import { UUIDSchemaValidation } from '@app/@common/application/validations';

import { GetOneProductsOutputDto } from '../dto';
import { ProductGetOneUseCase } from '../use-cases';

@Controller()
@UseFilters(new RemoteProcedureCallExceptionFilter())
@UseInterceptors(ClassSerializerInterceptor)
export class ProductGetOneController {
  constructor(private readonly useCase: ProductGetOneUseCase) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'View a product',
    description: 'View a product',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product information',
    type: GetOneProductsOutputDto,
  })
  async execute(
    @Param('id', new ZodValidationPipe(new UUIDSchemaValidation())) id: string,
  ): Promise<GetOneProductsOutputDto> {
    return this.useCase.execute(id);
  }

  @MessagePattern('products.getone')
  async getOneForEvents(id: string): Promise<GetOneProductsOutputDto> {
    return this.useCase.execute(id);
  }
}
