import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { AppExceptionFilter } from './filters/app-exception.filter';
import { JoiValidationPipe } from './pipes/JoiValidation.pipe';
import { ProductCreateSchema } from './validations/product-create.schema.validation';

type ResponseFindAll = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
};

@Controller()
@UseFilters(new AppExceptionFilter())
@UseInterceptors(ClassSerializerInterceptor)
export class AppController {
  constructor(private readonly service: AppService) {}

  @MessagePattern('products.findall')
  async findAll(@Payload('query') query): Promise<ResponseFindAll> {
    const page = (query.page && Number(query.page)) || 1;
    const limit = 2;
    const offset = limit * (page - 1);
    const { items, total } = await this.service.findAll({
      offset,
      limit,
    });

    return { items, total, page, limit };
  }

  @MessagePattern('products.findone')
  async findOne(id: string): Promise<Product | undefined> {
    return this.service.findOne(id);
  }

  @MessagePattern('products.create')
  async create(
    @Payload(new JoiValidationPipe(new ProductCreateSchema()))
    payload: CreateProductDto,
  ): Promise<Product | undefined> {
    return this.service.create(payload);
  }

  @MessagePattern('products.update')
  async update(): Promise<void> {
    return this.service.update();
  }
}
