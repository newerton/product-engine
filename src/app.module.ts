import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppExceptionFilter } from './filters/app-exception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from 'ormconfig';
import { Product } from './entities/product.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([Product]),
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE_KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'product',
            brokers: ['host.docker.internal:9094'],
          },
          consumer: {
            groupId: 'product-consumer',
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule {}
