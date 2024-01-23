import { Inject, Injectable } from '@nestjs/common';

import { ProductsDITokens } from '@core/products/domain/di';
import { ProductsRepository } from '@core/products/domain/port/repository';

import { GetOneProductsOutputDto } from '../dto';

@Injectable()
export class ProductGetOneUseCase {
  constructor(
    @Inject(ProductsDITokens.ProductsRepository)
    private readonly repository: ProductsRepository,
  ) {}

  execute(id: string): Promise<GetOneProductsOutputDto> {
    return this.repository.findOne({ id });
  }
}
