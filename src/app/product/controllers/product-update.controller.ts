import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
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

import { GetOneProductsOutputDto, ProductUpdateInputDto } from '../dto';
import { ProductUpdateUseCase } from '../use-cases';
import { ProductUpdateSchemaValidation } from '../validations';

@Controller('products')
@ApiTags('Products')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class ProductUpdateController {
  constructor(private readonly useCase: ProductUpdateUseCase) {}

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Update a product',
    description: 'Update a product',
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No Content' })
  async execute(
    @Param('id', new ZodValidationPipe(new UUIDSchemaValidation())) id: string,
    @Body(new ZodValidationPipe(new ProductUpdateSchemaValidation()))
    body: ProductUpdateInputDto,
  ): Promise<GetOneProductsOutputDto> {
    return this.useCase.execute(id, body);
  }

  @MessagePattern('products.update')
  async updateForEvents(
    @Payload(new ZodValidationPipe(new ProductUpdateSchemaValidation()))
    payload: ProductUpdateInputDto,
  ): Promise<GetOneProductsOutputDto> {
    const { id } = payload;
    return this.useCase.execute(id, payload);
  }
}
