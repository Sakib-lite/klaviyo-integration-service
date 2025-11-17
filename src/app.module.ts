import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import { WinstonConfigService } from './@core/config/winston/winston-config.service';
import { appConfig } from './@core/config/app-config/app-config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './@core/config/typeorm/typeorm-config.service';
import { ScheduleModule } from '@nestjs/schedule';
import { EventModule } from './modules/event/event.module';
import { MetricModule } from './modules/metric/metric.module';
import { ProfileModule } from './modules/profile/profile.module';
import { CleanupModule } from './modules/cleanup/cleanup.module';

@Module({
  imports: [
    ConfigModule.forRoot(appConfig),
    WinstonModule.forRootAsync({
      useClass: WinstonConfigService,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ScheduleModule.forRoot(),
    EventModule,
    MetricModule,
    ProfileModule,
    CleanupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
