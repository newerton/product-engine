import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ProductTypeORM } from '../entities/product.entity';

@Injectable()
export class ProductTypeORMRepository extends Repository<ProductTypeORM> {
  constructor(private readonly dataSource: DataSource) {
    super(
      ProductTypeORM,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }
}
