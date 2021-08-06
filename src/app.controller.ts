import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('products.create')
  async create(): Promise<void> {
    return await this.appService.create();
  }

  @MessagePattern('products.update')
  async update(): Promise<void> {
    return this.appService.update();
  }
}
