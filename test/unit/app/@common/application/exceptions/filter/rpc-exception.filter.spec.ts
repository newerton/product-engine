import { HttpException, Logger, UnauthorizedException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable } from 'rxjs';

import { RemoteProcedureCallExceptionFilter } from '@app/@common/application/exceptions/filter';
import { Code } from '@core/@shared/domain/error/Code';
import { Exception } from '@core/@shared/domain/exception/Exception';

export interface AxiosResponse {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

const mockAppLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

const mockRpcArgumentsHost = jest.fn().mockImplementation(() => ({
  getContext: jest.fn().mockImplementation(() => ({
    getPattern: () => '/',
  })),
}));
const mockArgumentsHost = {
  switchToHttp: jest.fn(),
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: mockRpcArgumentsHost,
  switchToWs: jest.fn(),
};

describe('RemoteProcedureCallExceptionFilter', () => {
  let service: RemoteProcedureCallExceptionFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoteProcedureCallExceptionFilter,
        {
          provide: Logger,
          useValue: mockAppLoggerService,
        },
      ],
    }).compile();
    service = module.get<RemoteProcedureCallExceptionFilter>(
      RemoteProcedureCallExceptionFilter,
    );
  });

  describe('All exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should call global RemoteProcedureCallExceptionFilter', () => {
      const mockRpcExceptionFilter = {
        code: Code.NOT_FOUND.code,
        name: Code.NOT_FOUND.error,
        message: 'Sample Exception',
        error: 'Sample Exception',
        details: [],
      };

      service.catch(mockRpcExceptionFilter, mockArgumentsHost);

      expect(mockRpcArgumentsHost).toHaveBeenCalledTimes(1);
      expect(mockRpcArgumentsHost).toHaveBeenCalledWith();
    });

    it('should call global RemoteProcedureCallExceptionFilter, expected throwError', () => {
      const mockRpcExceptionFilter = {
        code: Code.NOT_FOUND.code,
        name: Code.NOT_FOUND.error,
        message: 'Sample Exception',
        error: 'Sample Exception',
        details: [],
      };

      const host = {
        ...mockArgumentsHost,
        switchToRpc: jest.fn().mockImplementation(() => ({
          getContext: jest.fn().mockImplementation(null),
        })),
      };

      const exception = new RpcException('Test error');

      const result = service.catch(mockRpcExceptionFilter, host);

      expect(result).toBeInstanceOf(Observable);
      result.subscribe((err) => {
        expect(err).toBe(exception);
      });
    });

    it('should call global RemoteProcedureCallExceptionFilter, expected status 400 and status code 1000', () => {
      const mockHttpException = new HttpException(
        { message: 'Sample Exception' },
        Code.ENTITY_NOT_FOUND.code,
      );

      const exception = new RpcException('HttpException');
      const result = service.catch(mockHttpException as any, mockArgumentsHost);

      expect(result).toBeInstanceOf(Observable);
      result.subscribe((err) => {
        expect(err).toBe(exception);
      });
    });

    it('should call global HttpExceptionFilter with UnauthorizedException', () => {
      const mockHttpException = new UnauthorizedException({
        message: 'Sample Exception',
      });
      const exception = new RpcException('UnauthorizedException');
      const result = service.catch(mockHttpException as any, mockArgumentsHost);

      expect(result).toBeInstanceOf(Observable);
      result.subscribe((err) => {
        expect(err).toBe(exception);
      });
    });

    it('should call global HttpExceptionFilter with Exception', () => {
      const mockHttpException = Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: 'Bad Request Exception',
      });
      const exception = new RpcException('Exception');
      const result = service.catch(mockHttpException as any, mockArgumentsHost);

      expect(result).toBeInstanceOf(Observable);
      result.subscribe((err) => {
        expect(err).toBe(exception);
      });
    });
  });
});
