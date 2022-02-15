import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';

dotenv.config();

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 54323),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: process.env.NODE_ENV === 'development',
  autoLoadEntities: true,
  entities: ['./dist/**/*.entity{.ts,.js}'],
  migrations: ['./dist/**/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: './src/database/typeorm/migrations',
  },
};

export default config;
