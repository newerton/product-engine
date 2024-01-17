import { z } from 'zod';

import { CreateValidationSchema } from '@app/@common/application/validators/zod/schemas';

export class ProductCreateSchemaValidation implements CreateValidationSchema {
  createSchema(): z.ZodSchema {
    return z.object({
      title: z.string({
        description: 'Product title',
        invalid_type_error: 'Title must be a string',
        required_error: 'Title is required',
      }),
      description: z.string({
        description: 'Product description',
        invalid_type_error: 'Description must be a string',
        required_error: 'Description is required',
      }),
      price: z
        .number({
          description: 'Product price',
          invalid_type_error: 'Price must be a number',
          required_error: 'Price is required',
        })
        .min(1),
      discount_percentage: z
        .number({
          description: 'Product discount percentage',
          invalid_type_error: 'Discount percentage must be a number',
          required_error: 'Discount percentage is required',
        })
        .int()
        .min(0)
        .max(100),
      warranty: z.string({
        description: 'Product warranty',
        invalid_type_error: 'Warranty must be a string',
        required_error: 'Warranty is required',
      }),
      available: z
        .boolean({
          description: 'Product availability',
          invalid_type_error: 'Availability must be a boolean',
          required_error: 'Availability is required',
        })
        .default(false),
    });
  }
}
