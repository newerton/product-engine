import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';

dotenv.config();

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 3306),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: process.env.NODE_ENV === 'development',
  // cache: {
  //   type: 'redis',
  //   options: {
  //     host: process.env.REDIS_HOST,
  //     port: process.env.REDIS_PORT,
  //   },
  // },
  entities: ['./src/entities/*.ts'],
  migrations: ['./src/database/typeorm/migrations/*.ts'],
  cli: {
    migrationsDir: './src/database/typeorm/migrations',
  },
};

export default config;
