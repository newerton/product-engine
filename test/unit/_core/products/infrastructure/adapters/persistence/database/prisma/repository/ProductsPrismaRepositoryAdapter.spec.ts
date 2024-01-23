import { PrismaClient } from '@prisma/client';

import { Code } from '@core/@shared/domain/error/Code';
import { Exception } from '@core/@shared/domain/exception/Exception';
import {
  ProductsRepositoryFilter,
  ProductsRepositoryInput,
  ProductsRepositoryOutput,
} from '@core/products/domain/port/repository';
import { ProductsPrismaRepositoryAdapter } from '@core/products/infrastructure/adapters/persistence/database/prisma/repository';
import {
  generateProductInput,
  generateProductOutput,
} from '@test/common/fixtures';

// Mock do PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $transaction: jest.fn(async () => []),
    products: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  })),
}));

describe('ProductsPrismaRepositoryAdapter', () => {
  let prismaClient: PrismaClient;
  let repository: ProductsPrismaRepositoryAdapter;

  beforeEach(() => {
    prismaClient = new PrismaClient();
    repository = new ProductsPrismaRepositoryAdapter(prismaClient.products);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const input: ProductsRepositoryInput = generateProductInput();

      await repository.create(input);

      expect(prismaClient.products.create).toHaveBeenCalledWith({
        data: input,
      });
    });

    it('should throw an exception if error creating product', async () => {
      const input: ProductsRepositoryInput = generateProductInput();

      jest
        .spyOn(prismaClient.products, 'create')
        .mockRejectedValueOnce(new Error());

      await expect(repository.create(input)).rejects.toThrow(
        Exception.new({
          code: Code.INTERNAL_SERVER_ERROR.code,
          overrideMessage: 'Error creating product',
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should find all products with the provided filter', async () => {
      const page = 1;
      const limit = 20;
      const filter = {
        name: 'example',
      };

      await repository.findAll(page, limit, filter);

      expect(prismaClient.products.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: filter.name,
            mode: 'insensitive',
          },
          deleted_at: null,
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: 0,
        take: 20,
      });
    });
  });

  describe('findFull', () => {
    it('should find all products with the provided filter', async () => {
      const filter = {
        name: 'example',
      };

      await repository.findFull(filter);

      expect(prismaClient.products.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: filter.name,
            mode: 'insensitive',
          },
          deleted_at: null,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    });

    it('should throw an exception if no filter properties are provided', async () => {
      const filter = {};
      repository['extendQueryWithByProperties'] = jest
        .fn()
        .mockReturnValueOnce({});

      await expect(repository.findFull(filter)).rejects.toThrow(
        Exception.new({
          code: Code.BAD_REQUEST.code,
          overrideMessage: `Filter is required`,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should find one product with the provided filter', async () => {
      const filter = {
        id: '12345',
      };

      await repository.findOne(filter);

      expect(prismaClient.products.findFirst).toHaveBeenCalledWith({
        where: {
          id: filter.id,
        },
      });
    });
  });

  describe('update', () => {
    it('should update the product with the provided id and payload', async () => {
      const id = '12345';
      const input: Partial<ProductsRepositoryInput> = {
        name: 'First product',
        description: 'First product description',
        price: 12.34,
      };

      // Mockando a chamada ao método _get para retornar um modelo existente
      repository['_get'] = jest.fn().mockResolvedValueOnce({});

      await repository.update(id, input);

      expect(repository['_get']).toHaveBeenCalledWith(id);
      expect(prismaClient.products.update).toHaveBeenCalledWith({
        where: {
          id: id,
        },
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
        },
      });
    });

    it('should throw an exception if model update returns error', async () => {
      const id = '12345';
      const input: Partial<ProductsRepositoryInput> = {
        name: 'First product',
        description: 'First product description',
        price: 12.34,
      };

      jest
        .spyOn(prismaClient.products, 'update')
        .mockRejectedValueOnce(new Error('Error updating product'));

      repository['_get'] = jest.fn().mockResolvedValueOnce({});
      await expect(repository.update(id, input)).rejects.toThrow(
        Exception.new({
          code: Code.INTERNAL_SERVER_ERROR.code,
          overrideMessage: 'Error updating product',
        }),
      );
    });

    it('should throw an exception if the product is not found', async () => {
      const id = '12345';
      const input: Partial<ProductsRepositoryInput> = {
        name: 'First product',
        description: 'First product description',
        price: 12.34,
      };

      // Mockando a chamada ao método _get para retornar null (convidado não encontrado)
      jest.spyOn(prismaClient.products, 'update').mockResolvedValueOnce(null);

      await expect(repository.update(id, input)).rejects.toThrow(
        Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `Product not found`,
        }),
      );
    });

    it('should throw an exception if payload is empty', async () => {
      const id = '12345';
      const input: Partial<ProductsRepositoryInput> = {};
      repository['_get'] = jest.fn().mockResolvedValueOnce({});

      await expect(repository.update(id, input)).rejects.toThrow(
        Exception.new({
          code: Code.BAD_REQUEST.code,
          overrideMessage: `Payload is required`,
        }),
      );
    });

    it('should throw an exception if payload is null', async () => {
      const id = '12345';
      const input: Partial<ProductsRepositoryInput> = null;
      repository['_get'] = jest.fn().mockResolvedValueOnce({});

      await expect(repository.update(id, input)).rejects.toThrow(
        Exception.new({
          code: Code.BAD_REQUEST.code,
          overrideMessage: `Payload is required`,
        }),
      );
    });

    it('should throw an exception if payload is undefined', async () => {
      const id = '12345';
      const input: Partial<ProductsRepositoryInput> = undefined;
      repository['_get'] = jest.fn().mockResolvedValueOnce({});

      await expect(repository.update(id, input)).rejects.toThrow(
        Exception.new({
          code: Code.BAD_REQUEST.code,
          overrideMessage: `Payload is required`,
        }),
      );
    });
  });

  describe('delete', () => {
    it('should delete the product with the provided id', async () => {
      const id = '12345';

      repository['_get'] = jest.fn().mockResolvedValueOnce({});
      await repository.delete(id);

      expect(repository['_get']).toHaveBeenCalledWith(id);
      expect(prismaClient.products.update).toHaveBeenCalledWith({
        where: {
          id: id,
        },
        data: { deleted_at: expect.any(Date) },
      });
    });
  });

  describe('_get', () => {
    it('should return the product model if found', async () => {
      const id = '12345-12345-12345-12345-12345';
      const output = generateProductOutput();
      const model: ProductsRepositoryOutput = {
        ...output,
        id: id,
      };

      // Mockando a chamada ao método findUnique para retornar um modelo existente
      jest
        .spyOn(prismaClient.products, 'findUnique')
        .mockResolvedValueOnce(model);

      const result = await repository['_get'](id);

      expect(prismaClient.products.findUnique).toHaveBeenCalledWith({
        where: { id: id },
      });
      expect(result).toEqual(model);
    });

    it('should throw an exception if the product is not found', async () => {
      const id = '12345';

      // Mockando a chamada ao método findUnique para retornar null (convidado não encontrado)
      jest
        .spyOn(prismaClient.products, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(repository['_get'](id)).rejects.toThrow(
        Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `Product not found`,
        }),
      );

      expect(prismaClient.products.findUnique).toHaveBeenCalledWith({
        where: { id: id },
      });
    });
  });

  describe('extendQueryWithByProperties', () => {
    it('should extend the query with filter properties', () => {
      const filter: ProductsRepositoryFilter = {
        id: '12345',
        name: '12345',
        description: '12345',
        price: 12.34,
        discount_percentage: 0,
        available: true,
        warranty: '1 year',
        status: 'ACTIVE',
      };

      const result = repository['extendQueryWithByProperties'](filter);

      expect(result).toEqual({
        id: filter.id,
        name: {
          contains: filter.name,
          mode: 'insensitive',
        },
        description: {
          contains: filter.description,
          mode: 'insensitive',
        },
        price: filter.price,
        discount_percentage: filter.discount_percentage,
        available: filter.available,
        warranty: {
          contains: filter.warranty,
          mode: 'insensitive',
        },
        status: filter.status,
      });
    });

    it('should return an empty query if no filter properties are provided', () => {
      const result = repository['extendQueryWithByProperties']({});

      expect(result).toEqual({});
    });
  });
});
