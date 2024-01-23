import { DATABASE_URL } from '@app/@common/application/config';
import { DatabaseServerConfig } from '@core/@shared/infrastructure/config/env';

describe('authConfig', () => {
  it('should validate secret value', () => {
    const dialect = DatabaseServerConfig.DIALECT;
    const host = DatabaseServerConfig.HOST;
    const port = DatabaseServerConfig.PORT;
    const database = DatabaseServerConfig.DATABASE;
    const user = DatabaseServerConfig.USER;
    const pass = DatabaseServerConfig.PASSWORD;

    expect(DATABASE_URL).toBe(
      `${dialect}://${user}:${pass}@${host}:${port}/${database}`,
    );
  });
});
