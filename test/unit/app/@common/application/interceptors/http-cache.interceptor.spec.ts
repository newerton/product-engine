import { CacheModule } from '@nestjs/cache-manager';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';

import { HttpCacheInterceptor } from '@app/@common/application/interceptors';

const request = {
  method: 'GET',
  path: '/',
  _parsedUrl: { query: 'param1=value1&param2=value2' },
};
const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetRequest = jest.fn().mockImplementation(() => request);
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
  getClass: jest.fn(),
  getHandler: jest.fn(),
};

describe('HttpCacheInterceptor', () => {
  let interceptor: HttpCacheInterceptor;
  let reflector: Reflector;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [HttpCacheInterceptor, Reflector],
    }).compile();

    interceptor = moduleRef.get<HttpCacheInterceptor>(HttpCacheInterceptor);
    reflector = moduleRef.get<Reflector>(Reflector);
  });

  describe('trackBy', () => {
    it('should return cache key with query string if CACHE_KEY_METADATA is defined', () => {
      jest.spyOn(reflector, 'get').mockReturnValue('my-cache-key');

      const result = interceptor.trackBy(mockArgumentsHost);

      expect(result).toBe('my-cache-key-param1=value1&param2=value2');
    });

    it('should call super.trackBy if CACHE_KEY_METADATA is not defined', () => {
      jest.spyOn(reflector, 'get').mockReturnValue(undefined);

      const result = interceptor.trackBy(mockArgumentsHost);

      expect(result).toBeUndefined();
    });
  });
});
