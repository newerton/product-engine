import { CacheModule } from '@nestjs/cache-manager';
import { Module, Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import {
  RemoteProcedureCallExceptionFilter,
  ZodValidationExceptionFilter,
} from '@app/@common/application/exceptions/filter';
import { HttpLoggingInterceptor } from '@app/@common/application/interceptors';
import { ProductModule } from '@app/product/product.module';
import { ApiServerConfig } from '@core/@shared/infrastructure/config/env';

const filterProviders: Provider[] = [
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
    CacheModule.register({
      isGlobal: true,
    }),
    ProductModule,
  ],
  providers: [...filterProviders],
})
export class MainModule {}
