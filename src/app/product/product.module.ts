import { Module, Provider } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';

import { DatabaseModule } from '@app/@common/infrastructure/adapters/persistente/database/database.module';
import { PrismaDatabaseAdapter } from '@app/@common/infrastructure/adapters/persistente/database/prisma/prisma-database.adapter';
import { KafkaServerConfig } from '@core/@shared/infrastructure/config/env/kafka-server.config';
import { ProductsDITokens } from '@core/products/domain/di';
import { ProductsPrismaRepositoryAdapter } from '@core/products/infrastructure/adapters/persistence/database/prisma/repository';

import {
  ProductCreateController,
  ProductGetOneController,
  ProductListAllController,
  ProductUpdateController,
} from './controllers';
import {
  ProductCreateUseCase,
  ProductGetOneUseCase,
  ProductListAllUseCase,
  ProductUpdateUseCase,
} from './use-cases';

const persistenceProviders: Provider[] = [
  {
    provide: ProductsDITokens.ProductsRepository,
    useFactory: (prisma: PrismaClient) =>
      new ProductsPrismaRepositoryAdapter(prisma.products),
    inject: [PrismaDatabaseAdapter],
  },
];

const controllers = [
  ProductCreateController,
  ProductListAllController,
  ProductGetOneController,
  ProductUpdateController,
];

const useCases = [
  ProductCreateUseCase,
  ProductListAllUseCase,
  ProductGetOneUseCase,
  ProductUpdateUseCase,
];

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE_KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'product',
            brokers: KafkaServerConfig.brokers(),
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
  providers: [...useCases, ...persistenceProviders],
})
export class ProductModule {}
