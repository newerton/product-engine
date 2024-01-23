import { ArgumentsHost, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';

import { ZodValidationExceptionFilter } from '@app/@common/application/exceptions/filter';
import { ZodValidationException } from '@app/@common/application/pipes';

describe('ZodValidationExceptionFilter', () => {
  let filter: ZodValidationExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: Response;

  beforeEach(() => {
    filter = new ZodValidationExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue(mockResponse),
    } as any;
  });

  describe('catch', () => {
    it('should return a JSON response with the appropriate properties and status code', () => {
      const mockExceptionResponse = {
        message: 'Validation failed',
        details: new ZodError([]),
      };
      const mockException = new ZodValidationException(mockExceptionResponse);
      filter.catch(mockException, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 422,
        error: 'ZOD_VALIDATION_EXCEPTION',
        message: 'Validation failed',
        details: mockExceptionResponse.details,
      });
    });

    it('should handle cases where the ZodValidationException has no details', () => {
      const mockExceptionResponse = {
        message: 'Validation failed',
        details: [],
      };
      const mockException = new ZodValidationException(mockExceptionResponse);
      filter.catch(mockException, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 422,
        error: 'ZOD_VALIDATION_EXCEPTION',
        message: 'Validation failed',
        details: [],
      });
    });

    it('should handle cases where the exception has no response', () => {
      const mockException = new InternalServerErrorException('Error');
      filter.catch(mockException, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 500,
        code: 500,
        error: 'Internal Server Error',
        message: 'Error',
      });
    });
  });
});
