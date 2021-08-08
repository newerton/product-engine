import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from './app.exceptions';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<Product | undefined> {
    return this.repository.findOne(id);
  }

  async create(data: CreateProductDto): Promise<Product | undefined> {
    const { id } = await this.repository.save(data);
    if (id) {
      return await this.repository.findOne({ id });
    } else {
      throw new BadRequestException({ error: 'Product not created' });
    }
  }

  async update(): Promise<void> {
    throw new BadRequestException({ error: 'Not implemented' });
  }
}
