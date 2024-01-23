import { z } from 'zod';

import { CreateValidationSchema } from '@app/@common/application/validators/zod/schemas';

export class ProductQueryFilterSchemaValidation
  implements CreateValidationSchema
{
  createSchema(): z.Schema {
    return z
      .object({
        id: z
          .string({
            description: 'Id',
            invalid_type_error: 'Id must be a string',
            required_error: 'Id is required',
          })
          .uuid({ message: 'Id must be a valid UUID' })
          .trim()
          .min(1, { message: 'Id must be at least 1 character' })
          .optional(),
        name: z
          .string({
            description: 'Name',
            invalid_type_error: 'Name must be a string',
            required_error: 'Name is required',
          })
          .trim()
          .min(1, { message: 'Name must be at least 1 character' })
          .optional(),
        description: z
          .string({
            description: 'Description',
            invalid_type_error: 'Description must be a string',
            required_error: 'Description is required',
          })
          .trim()
          .min(1, { message: 'Description must be at least 1 character' })
          .optional(),
        price: z
          .number({
            description: 'Price',
            invalid_type_error: 'Price must be a number',
            required_error: 'Price is required',
          })
          .optional(),
        discount_percentage: z
          .number({
            description: 'Discount percentage',
            invalid_type_error: 'Discount percentage must be a number',
            required_error: 'Discount percentage is required',
          })
          .optional(),
        warranty: z
          .string({
            description: 'Warranty',
            invalid_type_error: 'Warranty must be a string',
            required_error: 'Warranty is required',
          })
          .trim()
          .min(1, { message: 'Warranty must be at least 1 character' })
          .optional(),
        available: z
          .boolean({
            description: 'Available',
            invalid_type_error: 'Available must be a boolean',
            required_error: 'Available is required',
          })
          .optional(),
        status: z
          .enum(['ACTIVE', 'INACTIVE', 'DELETED'], {
            description: 'Status',
            invalid_type_error: 'Status must be a enum',
            required_error: 'Status is required',
          })
          .optional(),
      })
      .optional();
  }
}
