import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import { WinstonConfigService } from './@core/config/winston/winston-config.service';
import { appConfig } from './@core/config/app-config/app-config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './@core/config/typeorm/typeorm-config.service';

@Module({
  imports: [
    ConfigModule.forRoot(appConfig),
    WinstonModule.forRootAsync({
      useClass: WinstonConfigService,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
