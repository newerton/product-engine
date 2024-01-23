import { Inject, Injectable } from '@nestjs/common';

import { ProductsDITokens } from '@core/products/domain/di';
import { ProductsRepository } from '@core/products/domain/port/repository';

import { ListAllProductsPagedOutputDto, ProductsQueryFiltersDto } from '../dto';

@Injectable()
export class ProductListAllUseCase {
  constructor(
    @Inject(ProductsDITokens.ProductsRepository)
    private readonly repository: ProductsRepository,
  ) {}

  async execute(
    filter: ProductsQueryFiltersDto,
    queryPage = 1,
  ): Promise<ListAllProductsPagedOutputDto> {
    const page = (queryPage && Number(queryPage)) || 1;
    const limit = 20;

    const { data, count } = await this.repository.findAll(page, limit, filter);

    return {
      data,
      count,
      page,
      limit,
    };
  }
}
