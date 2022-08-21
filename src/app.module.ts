import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Product } from './entities/product.entity';

import config from 'ormconfig';

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
            brokers: [
              `${process.env.KAFKA_BROKER_HOST}:${process.env.KAFKA_BROKER_PORT}`,
            ],
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
  providers: [AppService],
})
export class AppModule {}
