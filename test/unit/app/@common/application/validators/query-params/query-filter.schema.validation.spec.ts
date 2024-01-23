import { z } from 'zod';

import { QueryFilterSchema } from '@app/@common/application/validators/query-params/query-filter.schema.validation';

describe('QueryFilterSchema', () => {
  let schema: QueryFilterSchema;

  beforeEach(() => {
    schema = new QueryFilterSchema();
  });

  it('should create a valid schema', () => {
    const result = schema.createSchema();

    expect(result).toBeInstanceOf(z.ZodObject);
  });

  it('should validate a valid input', () => {
    const input = { page: 1 };
    const result = schema.createSchema().safeParse(input);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(input);
  });

  it('should validate and use default value for missing page', () => {
    const input = {};
    const result = schema.createSchema().safeParse(input);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ page: 1 });
  });

  it('should fail validation for non-integer page', () => {
    const input = { page: 1.5 };
    const result = schema.createSchema().safeParse(input);

    expect(result.success).toBe(false);
  });

  it('should fail validation for page less than 1', () => {
    const input = { page: 0 };
    const result = schema.createSchema().safeParse(input);

    expect(result.success).toBe(false);
  });
});
