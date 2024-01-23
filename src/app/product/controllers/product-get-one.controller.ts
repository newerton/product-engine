import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger';
import { ZodValidationPipe } from '@app/@common/application/pipes';
import { UUIDSchemaValidation } from '@app/@common/application/validations';

import { GetOneProductsOutputDto } from '../dto';
import { ProductGetOneUseCase } from '../use-cases';

@Controller('products')
@ApiTags('Products')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
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
