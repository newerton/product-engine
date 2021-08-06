import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JoiValidationExceptionFilter } from './filters/joi.validation-exception.filter';
import { AppExceptionFilter } from './filters/app-exception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from 'ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(config)],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: JoiValidationExceptionFilter,
    },
  ],
})
export class AppModule {}
