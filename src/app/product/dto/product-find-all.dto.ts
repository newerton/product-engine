import { ProductTypeORM } from '@app/@common/infrastructure/persistence/database/typeorm/entities/product.entity';

export class ProductFindAllUseCaseInput {
  offset: number;
  limit: number;
}

export class ProductFindAllUseCaseOutput {
  items: ProductTypeORM[];
  total: number;
}

export class ProductFindAllControllerOutput {
  items: ProductTypeORM[];
  total: number;
  page: number;
  limit: number;
}
