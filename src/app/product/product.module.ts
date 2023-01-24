import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ProductTypeORMRepository } from '@app/@common/infrastructure/persistence/database/typeorm/repository/product-typeorm.repository';
import { KafkaServerConfig } from '@core/@shared/infrastructure/config/env/kafka-server.config';

import {
  ProductCreateController,
  ProductFindAllController,
  ProductFindOneController,
  ProductUpdateController,
} from './controllers';
import {
  ProductCreateUseCase,
  ProductFindAllUseCase,
  ProductFindOneUseCase,
  ProductUpdateUseCase,
} from './use-cases';

const controllers = [
  ProductCreateController,
  ProductFindAllController,
  ProductFindOneController,
  ProductUpdateController,
];
const useCases = [
  ProductCreateUseCase,
  ProductFindAllUseCase,
  ProductFindOneUseCase,
  ProductUpdateUseCase,
];
const repositories = [ProductTypeORMRepository];

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE_KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'product',
            brokers: [
              `${KafkaServerConfig.KAFKA_BROKER_HOST}:${KafkaServerConfig.KAFKA_BROKER_PORT}`,
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
  controllers,
  providers: [...useCases, ...repositories],
})
export class ProductModule {}
