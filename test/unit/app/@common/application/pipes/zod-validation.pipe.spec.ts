import { Schema, ZodError, ZodIssue } from 'zod';

import {
  ZodValidationException,
  ZodValidationPipe,
} from '@app/@common/application/pipes';
import { CreateValidationSchema } from '@app/@common/application/validators/zod/schemas';

describe('ZodValidationPipe', () => {
  let zodValidationPipe: ZodValidationPipe;
  let mockSchema: Schema;

  beforeEach(() => {
    mockSchema = {
      parse: jest.fn(),
    } as any;
    const mockSchemaFactory: CreateValidationSchema = {
      createSchema: jest.fn().mockReturnValue(mockSchema),
    };
    zodValidationPipe = new ZodValidationPipe(mockSchemaFactory);
  });

  describe('transform', () => {
    it('should call schema.parse with the provided message', async () => {
      const message = { some: 'data' };
      await zodValidationPipe.transform(message);
      expect(mockSchema.parse).toHaveBeenCalledWith(message);
    });

    it('should throw a ZodValidationException with a custom error message and details when schema.parse throws a ZodError', async () => {
      const mockError = new ZodError([
        { message: 'age must be a number' } as ZodIssue,
      ]);

      mockSchema.parse = jest.fn().mockRejectedValueOnce(mockError);
      const message = { some: 'data' };

      try {
        await zodValidationPipe.transform(message);
      } catch (err) {
        expect(err).toBeInstanceOf(ZodValidationException);
        expect(err.getResponse()).toEqual({
          message: mockError.issues[0].message,
          details: mockError.issues,
        });
      }
    });

    it('should throw a ZodValidationException with the default error message and details when schema.parse throws an error other than ZodError', async () => {
      const mockError = new Error('Some other error');
      mockSchema.parse = jest.fn().mockRejectedValueOnce(mockError);
      const message = { some: 'data' };

      try {
        await zodValidationPipe.transform(message);
      } catch (err) {
        expect(err).toBeInstanceOf(ZodValidationException);
        expect(err.getResponse()).toEqual({
          message: mockError.message,
          details: mockError,
        });
      }
    });

    it('should return the provided message when schema.parse succeeds', async () => {
      const message = { some: 'data' };
      const result = await zodValidationPipe.transform(message);
      expect(result).toEqual(message);
    });
  });
});
