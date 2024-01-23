import { Inject, Injectable } from '@nestjs/common';

import { ProductsDITokens } from '@core/products/domain/di';
import {
  ProductsRepository,
  ProductsRepositoryInput,
} from '@core/products/domain/port/repository';

import { GetOneProductsOutputDto, ProductUpdateInputDto } from '../dto';

@Injectable()
export class ProductUpdateUseCase {
  constructor(
    @Inject(ProductsDITokens.ProductsRepository)
    private readonly repository: ProductsRepository,
  ) {}

  async execute(
    id: string,
    data: ProductUpdateInputDto,
  ): Promise<GetOneProductsOutputDto> {
    const payload = {} as ProductsRepositoryInput;

    if ('name' in data) {
      payload.name = data.name;
    }

    if ('description' in data) {
      payload.description = data.description;
    }

    if ('price' in data) {
      payload.price = data.price;
    }

    if ('discount_percentage' in data) {
      payload.discount_percentage = data.discount_percentage;
    }

    if ('warranty' in data) {
      payload.warranty = data.warranty;
    }

    if ('available' in data) {
      payload.available = data.available;
    }

    if ('status' in data) {
      payload.status = data.status;
    }

    return this.repository.update(id, payload);
  }
}
