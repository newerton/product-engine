import { prisma } from '@core/@shared/infrastructure/adapters/persistence/database/prisma';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client');

describe('PrismaClient', () => {
  it('should be defined', () => {
    expect(prisma).toBeInstanceOf(PrismaClient);
  });
});
