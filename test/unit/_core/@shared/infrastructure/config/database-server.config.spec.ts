import { DatabaseServerConfig } from '@core/@shared/infrastructure/config/env';

describe('DatabaseServerConfig', () => {
  it('should be defined', () => {
    expect(DatabaseServerConfig).toBeDefined();
  });

  it('should have DIALECT', () => {
    expect(DatabaseServerConfig.DIALECT).toBeDefined();
    expect(DatabaseServerConfig.DIALECT).toEqual(process.env.DB_DIALECT);
  });

  it('should have HOST', () => {
    expect(DatabaseServerConfig.HOST).toBeDefined();
    expect(DatabaseServerConfig.HOST).toEqual(process.env.DB_HOST);
  });

  it('should have PORT', () => {
    expect(DatabaseServerConfig.PORT).toBeDefined();
    expect(DatabaseServerConfig.PORT).toEqual(Number(process.env.DB_PORT));
  });

  it('should have USER', () => {
    expect(DatabaseServerConfig.PORT).toBeDefined();
    expect(DatabaseServerConfig.PORT).toEqual(Number(process.env.DB_PORT));
  });

  it('should have PASSWORD', () => {
    expect(DatabaseServerConfig.PASSWORD).toBeDefined();
    expect(DatabaseServerConfig.PASSWORD).toEqual(process.env.DB_PASSWORD);
  });

  it('should have DATABASE', () => {
    expect(DatabaseServerConfig.DATABASE).toBeDefined();
    expect(DatabaseServerConfig.DATABASE).toEqual(process.env.DB_DATABASE);
  });

  it('should have LOGGING', () => {
    expect(DatabaseServerConfig.LOGGING).toBeDefined();
    expect(DatabaseServerConfig.LOGGING).toEqual(
      process.env.DB_LOGGING === 'true',
    );
  });
});
