import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AppEnvironment, ConfigKey } from '../app-config/app-config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject()
  private configService: ConfigService;

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const environment = this.configService.get<string>(ConfigKey.APP_ENV);
    const isProduction = environment === AppEnvironment.PRODUCTION;

    return {
      type: 'mysql',
      host: this.configService.get<string>(ConfigKey.DATABASE_HOST),
      port: this.configService.get<number>(ConfigKey.DATABASE_PORT),
      username: this.configService.get<string>(ConfigKey.DATABASE_USERNAME),
      password: this.configService.get<string>(ConfigKey.DATABASE_PASSWORD),
      database: this.configService.get<string>(ConfigKey.DATABASE_NAME),
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
      synchronize: !isProduction,
      logging: !isProduction,
      charset: 'utf8mb4',
      timezone: '+00:00',
    };
  }
}
