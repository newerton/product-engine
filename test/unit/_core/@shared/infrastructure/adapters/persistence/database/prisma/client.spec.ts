import { PrismaClient } from '@prisma/client';

import { prisma } from '@core/@shared/infrastructure/adapters/persistence/database/prisma';

jest.mock('@prisma/client');

describe('PrismaClient', () => {
  it('should be defined', () => {
    expect(prisma).toBeInstanceOf(PrismaClient);
  });
});
