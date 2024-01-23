import { CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger';
import { ZodValidationPipe } from '@app/@common/application/pipes';

import { ListAllProductsPagedOutputDto, ProductsQueryFiltersDto } from '../dto';
import { ProductListAllUseCase } from '../use-cases';
import { ProductQueryFilterSchemaValidation } from '../validations';

@Controller('products')
@ApiTags('Products')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class ProductListAllController {
  constructor(private readonly useCase: ProductListAllUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all products',
    description: 'List all products',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ListAllProductsPagedOutputDto,
    description: 'List of products paginated and filtered with metadata',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    example: 1,
    allowEmptyValue: false,
    description: 'Page number',
  })
  @CacheTTL(1 * 86400)
  async execute(
    @Query(
      'filter',
      new ZodValidationPipe(new ProductQueryFilterSchemaValidation()),
    )
    filter: ProductsQueryFiltersDto,
    @Query('page') page: number,
  ): Promise<ListAllProductsPagedOutputDto> {
    return this.useCase.execute(filter, page);
  }

  @MessagePattern('products.findall')
  async findAllForEvents(
    @Payload('query') query,
  ): Promise<ListAllProductsPagedOutputDto> {
    const page = (query.page && Number(query.page)) || 1;
    const filter = query.filter || {};
    return this.useCase.execute(filter, page);
  }
}
