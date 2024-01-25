import { RedisServerConfig } from '@core/@shared/infrastructure/config/env';

describe('RedisServerConfig', () => {
  it('should have REDIS_HOST', () => {
    expect(RedisServerConfig.HOST).toBeDefined();
    expect(RedisServerConfig.HOST).toEqual(process.env.REDIS_HOST);
  });

  it('should have REDIS_PORT', () => {
    expect(RedisServerConfig.PORT).toBeDefined();
    expect(RedisServerConfig.PORT).toEqual(Number(process.env.REDIS_PORT));
  });

  it('should have REDIS_USER', () => {
    expect(RedisServerConfig.USER).toBeDefined();
    expect(RedisServerConfig.USER).toEqual(process.env.REDIS_USER);
  });

  it('should have REDIS_PASSWORD', () => {
    expect(RedisServerConfig.PASSWORD).toBeDefined();
    expect(RedisServerConfig.PASSWORD).toEqual(process.env.REDIS_PASSWORD);
  });
});
