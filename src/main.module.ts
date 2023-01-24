import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeormConfig } from '@app/@common/infrastructure/persistence/database/typeorm/config/typeorm.config';
import { ProductModule } from '@app/product/product.module';
@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), ProductModule],
})
export class MainModule {}
