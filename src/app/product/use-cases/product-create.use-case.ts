import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { ProductTypeORMRepository } from '@app/@common/infrastructure/persistence/database/typeorm/repository/product-typeorm.repository';
import { Code } from '@core/@shared/domain/error/Code';
import { Exception } from '@core/@shared/domain/exception/Exception';

import { ProductCreateInput } from '../dto/product-create.dto';

@Injectable()
export class ProductCreateUseCase {
  constructor(
    private readonly productRepository: ProductTypeORMRepository,
    @Inject('PRODUCT_SERVICE_KAFKA') private readonly clientKafka: ClientKafka,
  ) {}

  async execute(data: ProductCreateInput): Promise<void> {
    try {
      const { id } = await this.productRepository.save(data);
      if (id) {
        this.clientKafka.emit('product_created', data);
      } else {
        throw Exception.new({
          code: Code.BAD_REQUEST.code,
          overrideMessage: 'Product not created',
        });
      }
    } catch (err) {
      throw Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: 'Product not created',
      });
    }
  }
}
