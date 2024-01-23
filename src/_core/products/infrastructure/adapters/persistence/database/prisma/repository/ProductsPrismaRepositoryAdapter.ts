import { Prisma, PrismaClient } from '@prisma/client';

import { Code } from '@core/@shared/domain/error/Code';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { prisma } from '@core/@shared/infrastructure/adapters/persistence/database/prisma';
import {
  ProductsRepository,
  ProductsRepositoryCountOutput,
  ProductsRepositoryFilter,
  ProductsRepositoryInput,
  ProductsRepositoryOutput,
} from '@core/products/domain/port/repository/ProductsRepository';

export class ProductsPrismaRepositoryAdapter implements ProductsRepository {
  constructor(private model: PrismaClient['products']) {}

  async create(
    entity: ProductsRepositoryInput,
  ): Promise<ProductsRepositoryOutput> {
    const model: Prisma.ProductsCreateInput = {
      name: entity.name,
      description: entity.description,
      price: entity.price,
      discount_percentage: entity.discount_percentage,
      warranty: entity.warranty,
      available: entity.available,
      status: entity.status,
    };

    try {
      return await this.model.create({ data: model });
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: `Error creating product`,
        data: error,
      });
    }
  }

  async findAll(
    page: number,
    limit: number,
    filter: ProductsRepositoryFilter,
  ): Promise<ProductsRepositoryCountOutput> {
    const where = this.extendQueryWithByProperties(filter);

    const skip = limit * (page - 1);
    const take = limit;
    const [data, count] = await prisma.$transaction([
      this.model.findMany({
        where: { ...where, deleted_at: null },
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      this.model.count({ where: { ...where, deleted_at: null } }),
    ]);

    return {
      data,
      count,
    };
  }

  async findFull(
    filter: ProductsRepositoryFilter,
  ): Promise<ProductsRepositoryOutput[]> {
    const where = this.extendQueryWithByProperties(filter);

    if (Object.keys(where).length === 0 && where.constructor === Object) {
      throw Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: `Filter is required`,
      });
    }

    return this.model.findMany({
      where: { ...where, deleted_at: null },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(
    filter: ProductsRepositoryFilter,
  ): Promise<ProductsRepositoryOutput> {
    const where = this.extendQueryWithByProperties(filter);
    return this.model.findFirst({ where });
  }

  async update(
    id: string,
    payload: Partial<ProductsRepositoryInput>,
  ): Promise<ProductsRepositoryOutput> {
    if (
      !payload ||
      (Object.keys(payload).length === 0 && payload.constructor === Object)
    ) {
      throw Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: `Payload is required`,
      });
    }

    await this._get(id);
    const data = this.prepareDataToUpdate(payload);

    try {
      return await this.model.update({ where: { id }, data });
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: `Error updating product`,
        data: error,
      });
    }
  }

  async delete(id: string): Promise<ProductsRepositoryOutput> {
    await this._get(id);
    return this.model.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  private async _get(id: string): Promise<any> {
    const _id = `${id}`;
    const model = await this.model.findUnique({
      where: { id: _id },
    });
    if (!model) {
      throw Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: `Product not found`,
      });
    }
    return model;
  }

  private extendQueryWithByProperties(filter: ProductsRepositoryFilter): any {
    const query: Prisma.ProductsWhereInput = {};

    if (filter) {
      if ('id' in filter) {
        query.id = filter.id;
      }

      if ('name' in filter) {
        query.name = {
          contains: filter.name,
          mode: 'insensitive',
        };
      }

      if ('description' in filter) {
        query.description = {
          contains: filter.description,
          mode: 'insensitive',
        };
      }

      if ('price' in filter && typeof filter.price === 'number') {
        query.price = filter.price;
      }

      if (
        'discount_percentage' in filter &&
        typeof filter.discount_percentage === 'number'
      ) {
        query.discount_percentage = filter.discount_percentage;
      }

      if ('warranty' in filter) {
        query.warranty = {
          contains: filter.warranty,
          mode: 'insensitive',
        };
      }

      if ('available' in filter) {
        query.available = filter.available;
      }

      if ('status' in filter) {
        query.status = filter.status;
      }
    }

    return query;
  }

  private prepareDataToUpdate(payload: Partial<ProductsRepositoryInput>): any {
    const data = {
      ...(payload.name && {
        name: payload.name,
      }),
      ...(payload.description && {
        description: payload.description,
      }),
      ...(payload.price && {
        price: payload.price,
      }),
      ...(payload.discount_percentage && {
        discount_percentage: payload.discount_percentage,
      }),
      ...(payload.warranty && {
        warranty: payload.warranty,
      }),
      ...(payload.available && {
        available: payload.available,
      }),
      ...(payload.status && {
        status: payload.status,
      }),
    };
    return data;
  }
}
