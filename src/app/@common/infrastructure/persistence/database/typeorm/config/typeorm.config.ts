import * as path from 'path';

import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { ApiServerConfig } from '@core/@shared/infrastructure/config/env/api-server.config';
import { DatabaseServerConfig } from '@core/@shared/infrastructure/config/env/database-server.config';

dotenv.config();

const defaultConfig: DataSourceOptions = {
  type: DatabaseServerConfig.DIALECT as any,
  host: DatabaseServerConfig.HOST,
  port: +(DatabaseServerConfig.PORT || 3306),
  username: DatabaseServerConfig.USER,
  password: DatabaseServerConfig.PASSWORD,
  database: DatabaseServerConfig.DATABASE,
  logging: DatabaseServerConfig.LOGGING,
  charset: 'utf8mb4_unicode_ci',
  entities: [
    path.normalize(__dirname + `/../../typeorm/entities/*.entity{.ts,.js}`),
  ],
  migrations: [
    path.normalize(__dirname + `/../../typeorm/migrations/*{.ts,.js}`),
  ],
};

const testConfig: DataSourceOptions = {
  ...defaultConfig,
  database: DatabaseServerConfig.DATABASE,
  logging: DatabaseServerConfig.LOGGING,
  synchronize: true,
};

export const typeormConfig =
  ApiServerConfig.ENV === 'test' ? testConfig : defaultConfig;

export const dataSource = new DataSource(typeormConfig);
