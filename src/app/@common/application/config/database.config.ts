import { DatabaseServerConfig } from '@core/@shared/infrastructure/config/env/database-server.config';

const dialect = DatabaseServerConfig.DIALECT;
const host = DatabaseServerConfig.HOST;
const port = DatabaseServerConfig.PORT;
const database = DatabaseServerConfig.DATABASE;
const user = DatabaseServerConfig.USER;
const pass = DatabaseServerConfig.PASSWORD;

export const DATABASE_URL = `${dialect}://${user}:${pass}@${host}:${port}/${database}`;
