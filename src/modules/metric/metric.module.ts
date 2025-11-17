import { Module } from '@nestjs/common';
import { MetricController } from './metric.controller';
import { MetricService } from './metric.service';
import { KlaviyoModule } from '../klaviyo/klaviyo.module';

@Module({
  imports: [KlaviyoModule],
  controllers: [MetricController],
  providers: [MetricService],
  exports: [MetricService],
})
export class MetricModule {}
