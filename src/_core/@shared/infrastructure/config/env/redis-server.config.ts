import * as dotenv from 'dotenv';
import { from, logger } from 'env-var';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});
const env = from(process.env, { logger });

export class RedisServerConfig {
  public static readonly HOST: string = env
    .get('REDIS_HOST')
    .required()
    .asString();

  public static readonly PORT: number = env
    .get('REDIS_PORT')
    .required()
    .asPortNumber();

  public static readonly USER: string = env
    .get('REDIS_USER')
    .required()
    .asString();

  public static readonly PASSWORD: string = env
    .get('REDIS_PASSWORD')
    .required()
    .asString();
}
