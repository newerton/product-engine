import { z } from 'zod';

import { CreateValidationSchema } from '../validators/zod/schemas';

export class UUIDSchemaValidation implements CreateValidationSchema {
  createSchema(): z.Schema {
    return z
      .string({
        description: 'UUID',
        invalid_type_error: 'UUID must be a string',
        required_error: 'UUID is required',
      })
      .uuid({
        message: 'UUID must be a valid UUID',
      });
  }
}
