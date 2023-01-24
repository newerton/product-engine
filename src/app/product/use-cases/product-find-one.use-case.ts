import { Injectable } from '@nestjs/common';

import { ProductTypeORM } from '@app/@common/infrastructure/persistence/database/typeorm/entities/product.entity';
import { ProductTypeORMRepository } from '@app/@common/infrastructure/persistence/database/typeorm/repository/product-typeorm.repository';

@Injectable()
export class ProductFindOneUseCase {
  constructor(private readonly productRepository: ProductTypeORMRepository) {}

  execute(id: string): Promise<ProductTypeORM | undefined> {
    return this.productRepository.findOneBy({ id });
  }
}
