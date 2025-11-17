import { z } from 'zod';
import { AppEnvironment } from '../../constants/app-constants';

const envSchema = z.object({
  APP_ENV: z.nativeEnum(AppEnvironment),
  PORT: z.coerce.number(),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string().optional().default(''),
  DATABASE_NAME: z.string(),
  APP_URL: z.string(),
});

export const appConfig = {
  isGlobal: true,
  validate: (config: Record<string, unknown>) => {
    const result = envSchema.safeParse(config);
    if (!result.success) {
      throw new Error(`Config validation error: ${result.error.message}`);
    }
    return result.data;
  },
};

export enum ConfigKey {
  APP_ENV = 'APP_ENV',
  PORT = 'PORT',
  DATABASE_HOST = 'DATABASE_HOST',
  DATABASE_PORT = 'DATABASE_PORT',
  DATABASE_USERNAME = 'DATABASE_USERNAME',
  DATABASE_PASSWORD = 'DATABASE_PASSWORD',
  DATABASE_NAME = 'DATABASE_NAME',
  APP_URL = 'APP_URL',
}

export { AppEnvironment };
