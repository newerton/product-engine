import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger';
import { ZodValidationPipe } from '@app/@common/application/pipes';

import { ProductCreateInputDto, ProductCreateOutputDto } from '../dto';
import { ProductCreateUseCase } from '../use-cases';
import { ProductCreateSchemaValidation } from '../validations';

@Controller('products')
@ApiTags('Products')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class ProductCreateController {
  constructor(private readonly useCase: ProductCreateUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new products' })
  @ApiBody({
    type: ProductCreateInputDto,
    description: 'Create products input',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Created',
    type: ProductCreateOutputDto,
  })
  async create(
    @Body(new ZodValidationPipe(new ProductCreateSchemaValidation()))
    body: ProductCreateInputDto,
  ) {
    return this.useCase.execute(body);
  }

  @MessagePattern('products.create')
  async createForEvents(
    @Payload(new ZodValidationPipe(new ProductCreateSchemaValidation()))
    payload: ProductCreateInputDto,
  ) {
    return this.useCase.execute(payload);
  }
}
