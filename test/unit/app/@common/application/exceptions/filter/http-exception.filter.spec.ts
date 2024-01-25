import {
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { HttpExceptionFilter } from '@app/@common/application/exceptions/filter/http-exception.filter';
import { Code, CodeDescription } from '@core/@shared/domain/error/Code';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { ApiServerConfig } from '@core/@shared/infrastructure/config/env';

export interface AxiosResponse {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}
class AxiosError extends Error {
  config?: any;
  code?: string;
  request?: any;
  response?: AxiosResponse;
  isAxiosError: boolean;
  status?: number;
  toJSON: () => object;
  cause?: Error;

  constructor(
    message?: string,
    code?: string,
    config?: any,
    request?: any,
    response?: AxiosResponse,
  ) {
    super(message);
    this.config = config;
    this.code = code;
    this.request = request;
    this.response = response;
    this.isAxiosError = true;
    this.toJSON = () => ({
      message: this.message,
      name: this.name,
      stack: this.stack,
      config: this.config,
      code: this.code,
      request: this.request,
      response: this.response,
    });
    this.cause = response ? response.data : undefined;
  }
}

const mockAppLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};
const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetRequest = jest.fn().mockImplementation(() => ({
  method: 'GET',
  path: '/',
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getRequest: mockGetRequest,
  getResponse: mockGetResponse,
}));
const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('HttpExceptionFilter', () => {
  let service: HttpExceptionFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpExceptionFilter,
        {
          provide: Logger,
          useValue: mockAppLoggerService,
        },
      ],
    }).compile();
    service = module.get<HttpExceptionFilter>(HttpExceptionFilter);
  });

  describe('All exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should call global HttpExceptionFilter, expected status code 404', () => {
      const mockHttpException = new HttpException(
        { message: 'Sample Exception' },
        HttpStatus.NOT_FOUND,
      );
      service.catch(mockHttpException, mockArgumentsHost);

      expect(mockHttpArgumentsHost).toBeCalledTimes(2);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.NOT_FOUND);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        code: 404,
        error: 'NOT_FOUND',
        message: 'Sample Exception',
        details: [],
      });
    });

    it('should call global HttpExceptionFilter, expected status 400 and status code 1000', () => {
      const mockHttpException = new HttpException(
        { message: 'Sample Exception' },
        Code.ENTITY_NOT_FOUND.code,
      );
      service.catch(mockHttpException, mockArgumentsHost);

      expect(mockStatus).toBeCalledWith(Code.INTERNAL_SERVER_ERROR.code);
      expect(mockJson).toBeCalledWith({
        code: Code.ENTITY_NOT_FOUND.code,
        error: 'ENTITY_NOT_FOUND',
        message: 'Sample Exception',
        details: [],
      });
    });

    it('should call global HttpExceptionFilter with UnauthorizedException', () => {
      const mockHttpException = new UnauthorizedException({
        message: 'Sample Exception',
      });
      service.catch(mockHttpException, mockArgumentsHost);

      expect(mockStatus).toBeCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockJson).toBeCalledWith({
        code: 401,
        error: 'UNAUTHORIZED',
        message: 'Sample Exception',
        details: [],
      });
    });

    it('should call global HttpExceptionFilter with Exception', () => {
      const mockHttpException = Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: 'Bad Request Exception',
      });
      service.catch(mockHttpException, mockArgumentsHost);

      expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toBeCalledWith({
        code: 400,
        error: 'BAD_REQUEST',
        message: 'Bad Request Exception',
        details: [],
      });
    });

    it('should call global HttpExceptionFilter with Invalid Exception', () => {
      const INVALID: CodeDescription = {
        code: 99,
        error: 'INVALID',
        message: 'Invalid',
      };

      const mockHttpException = Exception.new({
        code: INVALID.code,
        overrideMessage: 'Bad Request Exception',
      });
      service.catch(mockHttpException, mockArgumentsHost);

      expect(mockStatus).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toBeCalledWith({
        code: 500,
        error: 'Internal server error',
        message: 'Status code not found',
        details: [],
      });
    });

    it('should call global HttpExceptionFilter with AxiosError', () => {
      const response: AxiosResponse = {
        data: {
          code: 99,
          error: 'INVALID',
          message: 'Bad Request Exception',
          details: [],
        },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      };

      const mockHttpException = new AxiosError(
        'Bad Request Exception',
        '400',
        null,
        null,
        response,
      );
      service.catch(mockHttpException, mockArgumentsHost);

      expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toBeCalledWith({
        code: 400,
        error: 'BAD_REQUEST',
        message: 'Bad request',
        details: [],
      });
    });

    it('should call global HttpExceptionFilter with AxiosError without status code', () => {
      const response: AxiosResponse = {
        data: {
          code: 99,
          error: 'INVALID',
          message: 'Bad Request Exception',
          details: [],
        },
        status: null,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      };

      const mockHttpException = new AxiosError(
        'Bad Request Exception',
        null,
        null,
        null,
        response,
      );
      service.catch(mockHttpException, mockArgumentsHost);

      expect(mockStatus).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toBeCalledWith({
        code: 500,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        details: [],
      });
    });

    it('should call global HttpExceptionFilter with AxiosError ECONNREFUSED status code', () => {
      const response: AxiosResponse = {
        data: {
          code: 'ECONNREFUSED',
          error: 'ECONNREFUSED',
          message: 'ECONNREFUSED',
          details: [],
        },
        status: null,
        statusText: 'ECONNREFUSED',
        headers: {},
        config: {} as any,
      };

      const mockHttpException = new AxiosError(
        'ECONNREFUSED',
        'ECONNREFUSED',
        null,
        null,
        response,
      );
      service.catch(mockHttpException, mockArgumentsHost);

      expect(mockStatus).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toBeCalledWith({
        code: 500,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Servidor não encontrado',
        details: [],
      });
    });

    it('should log the error when the environment is development', async () => {
      const mockHttpException = Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: 'Bad Request Exception',
      });

      Object.defineProperty(ApiServerConfig, 'ENV', {
        value: 'development',
        configurable: true,
      });

      const filter = new HttpExceptionFilter();
      const spyConsoleLog = jest.spyOn(console, 'log');

      filter.catch(mockHttpException, mockArgumentsHost);

      expect(spyConsoleLog).toHaveBeenCalledWith(mockHttpException);

      spyConsoleLog.mockRestore();
    });

    it('should not log the error when the environment is not development', () => {
      const mockHttpException = Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: 'Bad Request Exception',
      });

      Object.defineProperty(ApiServerConfig, 'ENV', {
        value: 'production',
        configurable: true,
      });

      const filter = new HttpExceptionFilter();
      const spyConsoleLog = jest.spyOn(console, 'log');

      filter.catch(mockHttpException, mockArgumentsHost);

      expect(spyConsoleLog).not.toHaveBeenCalled();

      spyConsoleLog.mockRestore();
    });
  });
});
