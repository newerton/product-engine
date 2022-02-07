import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { JoiValidationPipe } from './pipes/JoiValidation.pipe';
import { ProductCreateSchema } from './validations/product-create.schema.validation';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('products.findall')
  async findAll(): Promise<Product[]> {
    return await this.appService.findAll();
  }

  @MessagePattern('products.findone')
  async findOne(id: string): Promise<Product | undefined> {
    return this.appService.findOne(id);
  }

  @MessagePattern('products.create')
  async create(
    @Payload('value', new JoiValidationPipe(new ProductCreateSchema()))
    value: CreateProductDto,
  ): Promise<Product | undefined> {
    return await this.appService.create(value);
  }

  @MessagePattern('products.update')
  async update(): Promise<void> {
    return this.appService.update();
  }
}
