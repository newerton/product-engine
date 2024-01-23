import { Module } from '@nestjs/common';

import { PrismaDatabaseAdapter } from './prisma/prisma-database.adapter';

@Module({
  providers: [PrismaDatabaseAdapter],
  exports: [PrismaDatabaseAdapter],
})
export class DatabaseModule {}
