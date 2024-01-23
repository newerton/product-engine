import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Cache } from 'cache-manager';

import { Code } from '@core/@shared/domain/error/Code';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { ProductsDITokens } from '@core/products/domain/di';
import { ProductsStatusEnum } from '@core/products/domain/entities';
import {
  ProductsRepository,
  ProductsRepositoryInput,
} from '@core/products/domain/port/repository';

import { ProductCreateInputDto } from '../dto';
import { productClearCache } from '../utils';

@Injectable()
export class ProductCreateUseCase {
  constructor(
    @Inject(ProductsDITokens.ProductsRepository)
    private readonly repository: ProductsRepository,

    @Inject('PRODUCT_SERVICE_KAFKA')
    private readonly clientKafka: ClientKafka,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async execute(payload: ProductCreateInputDto) {
    const model: ProductsRepositoryInput = {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      discount_percentage: payload.discount_percentage,
      warranty: payload.warranty,
      available: payload.available,
      status: ProductsStatusEnum.ACTIVE,
    };

    try {
      const product = await this.repository.create(model);
      this.clientKafka.emit('product_created', product);

      await productClearCache(this.cacheManager);
      return product;
    } catch (err) {
      throw Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: 'Product not created',
      });
    }
  }
}
