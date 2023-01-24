import { Injectable } from '@nestjs/common';

import { ProductTypeORMRepository } from '@app/@common/infrastructure/persistence/database/typeorm/repository/product-typeorm.repository';
import {
  ProductFindAllUseCaseInput,
  ProductFindAllUseCaseOutput,
} from '@app/dto/product-find-all.dto';

@Injectable()
export class ProductFindAllUseCase {
  constructor(private readonly productRepository: ProductTypeORMRepository) {}

  async execute({
    offset,
    limit,
  }: ProductFindAllUseCaseInput): Promise<ProductFindAllUseCaseOutput> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .orderBy('created_at', 'DESC')
      .offset(offset)
      .limit(limit);

    const [items, total] = await queryBuilder.getManyAndCount();
    if (total === 0) {
      const count = await queryBuilder.getCount();
      return { items, total: count };
    }
    return { items, total };
  }
}
