import { CacheModule } from '@nestjs/cache-manager';
import { Module, Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';

import {
  HttpExceptionFilter,
  RemoteProcedureCallExceptionFilter,
  ZodValidationExceptionFilter,
} from '@app/@common/application/exceptions/filter';
import { HttpLoggingInterceptor } from '@app/@common/application/interceptors';
import { ProductModule } from '@app/product/product.module';
import {
  ApiServerConfig,
  RedisServerConfig,
} from '@core/@shared/infrastructure/config/env';

const filterProviders: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: RemoteProcedureCallExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: ZodValidationExceptionFilter,
  },
];

if (ApiServerConfig.LOG_ENABLE) {
  filterProviders.push({
    provide: APP_INTERCEPTOR,
    useClass: HttpLoggingInterceptor,
  });
}

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      socket: {
        host: RedisServerConfig.HOST,
        port: RedisServerConfig.PORT,
      },
      username: RedisServerConfig.USER,
      password: RedisServerConfig.PASSWORD,
    }),
    ProductModule,
  ],
  providers: [...filterProviders],
})
export class MainModule {}
