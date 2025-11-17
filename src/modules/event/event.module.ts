import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event } from './entity/event.entity';
import { KlaviyoModule } from '../klaviyo/klaviyo.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), KlaviyoModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
