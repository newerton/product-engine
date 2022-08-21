import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from './app.exceptions';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

type RequestFindAllProps = {
  offset: number;
  limit: number;
};

type PaginationResponse = {
  items: Product[];
  total: number;
};

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Product) private repository: Repository<Product>,
    @Inject('PRODUCT_SERVICE_KAFKA') private readonly clientKafka: ClientKafka,
  ) {}

  async findAll({
    offset,
    limit,
  }: RequestFindAllProps): Promise<PaginationResponse> {
    const queryBuilder = this.repository
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

  findOne(id: string): Promise<Product | undefined> {
    return this.repository.findOneBy({ id });
  }

  async create(data: CreateProductDto): Promise<Product | undefined> {
    try {
      const { id } = await this.repository.save(data);
      if (id) {
        this.clientKafka.emit('product_created', data);
        return this.repository.findOneBy({ id });
      } else {
        throw new BadRequestException('Product not created');
      }
    } catch (err) {
      throw new BadRequestException('Product not created');
    }
  }

  async update(): Promise<void> {
    throw new BadRequestException('Not implemented');
  }
}
