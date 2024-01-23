import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

import { HttpLoggingInterceptor } from '@app/@common/application/interceptors/http-logging.interceptor';

const mockAppLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  log: jest.fn(),
};
const request = {
  method: 'GET',
  path: '/',
};
const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetRequest = jest.fn().mockImplementation(() => request);
const mockGetRequestUndefined = jest.fn().mockImplementation(() => ({
  method: undefined,
  path: undefined,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getRequest: mockGetRequest,
  getResponse: mockGetResponse,
}));
const mockHttpArgumentsHostUndefined = jest.fn().mockImplementation(() => ({
  getRequest: mockGetRequestUndefined,
  getResponse: mockGetResponse,
}));
const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
  getClass: jest.fn(),
  getHandler: jest.fn(),
};
const mockArgumentsHostUndefined = {
  switchToHttp: mockHttpArgumentsHostUndefined,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
  getClass: jest.fn(),
  getHandler: jest.fn(),
};

const mockHandle = jest.fn().mockImplementation(() => ({
  pipe: jest.fn(),
}));
const mockCallHandler = {
  handle: mockHandle,
};

describe('HttpLoggingInterceptor', () => {
  let service: HttpLoggingInterceptor;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpLoggingInterceptor,
        {
          provide: Logger,
          useValue: mockAppLoggerService,
        },
      ],
    }).compile();
    service = module.get<HttpLoggingInterceptor>(HttpLoggingInterceptor);
  });

  describe('All exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should call global HttpLoggingInterceptor with Request', () => {
      service.intercept(mockArgumentsHost, mockCallHandler);

      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetRequest).toBeCalledTimes(1);
      expect(mockGetRequest).toBeCalledWith();
    });

    it('should call global HttpLoggingInterceptor with Request undefined', () => {
      service.intercept(mockArgumentsHostUndefined, mockCallHandler);

      expect(mockHttpArgumentsHostUndefined).toBeCalledTimes(1);
      expect(mockHttpArgumentsHostUndefined).toBeCalledWith();
      expect(mockGetRequestUndefined).toBeCalledTimes(1);
      expect(mockGetRequestUndefined).toBeCalledWith();
    });

    it('should validate the message', () => {
      const requestStartDate: number = Date.now();
      const response = service.message(request as Request, requestStartDate);
      expect(response).toBe('Method: GET; Path: /; SpentTime: 0ms');
    });

    it('should validate if the Logger has been instantiated', () => {
      const loggerSpy = jest.spyOn(Logger, 'log');

      const requestStartDate: number = Date.now();
      service.tapLogger(request as Request, requestStartDate)();

      expect(loggerSpy).toHaveBeenCalledTimes(1);
      expect(loggerSpy).toHaveBeenCalledWith(
        'Method: GET; Path: /; SpentTime: 0ms',
        'HttpLoggingInterceptor',
      );
    });
  });
});
