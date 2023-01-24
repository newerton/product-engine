import * as path from 'path';

import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { ApiServerConfig } from '@core/@shared/infrastructure/config/env/api-server.config';
import { DatabaseServerConfig } from '@core/@shared/infrastructure/config/env/database-server.config';

dotenv.config();

const defaultConfig: DataSourceOptions = {
  type: DatabaseServerConfig.DB_DIALECT as any,
  host: DatabaseServerConfig.DB_HOST,
  port: +(DatabaseServerConfig.DB_PORT || 3306),
  username: DatabaseServerConfig.DB_USER,
  password: DatabaseServerConfig.DB_PASSWORD,
  database: DatabaseServerConfig.DB_DATABASE,
  logging: DatabaseServerConfig.DB_LOGGING,
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
  database: DatabaseServerConfig.DB_DATABASE,
  logging: DatabaseServerConfig.DB_LOGGING,
  synchronize: true,
};

export const typeormConfig =
  ApiServerConfig.ENV === 'test' ? testConfig : defaultConfig;

export const dataSource = new DataSource(typeormConfig);
