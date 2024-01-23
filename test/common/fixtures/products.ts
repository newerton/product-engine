import { randomUUID } from 'crypto';

import { ProductsStatusEnum } from '@core/products/domain/entities';
import {
  ProductsRepositoryInput,
  ProductsRepositoryOutput,
} from '@core/products/domain/port/repository';

const input: ProductsRepositoryInput = {
  name: 'First product',
  description: 'First product description'.repeat(10),
  price: 12.34,
  discount_percentage: 0,
  available: true,
  warranty: '1 year',
  status: ProductsStatusEnum.ACTIVE,
};

const output: ProductsRepositoryOutput = {
  id: randomUUID(),
  name: 'First product',
  description: 'First product description'.repeat(10),
  price: 12.34,
  discount_percentage: 0,
  available: true,
  warranty: '1 year',
  status: ProductsStatusEnum.ACTIVE,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};

export const generateProductInput = (): ProductsRepositoryInput => input;

export const generateProductOutput = (): ProductsRepositoryOutput => output;
