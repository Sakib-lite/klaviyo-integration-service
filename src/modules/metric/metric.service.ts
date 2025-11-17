import { Injectable, Logger } from '@nestjs/common';
import { KlaviyoService } from '../klaviyo/klaviyo.service';
import {
  MetricsResponseDto,
  MetricCountResponseDto,
  MetricEmailsResponseDto,
} from './dto/metric-response.dto';
import { ParamsHandlerDto } from '../../@core/dtos/params-handler.dto';
import { paginateArray } from '../../@core/helpers/pagination.helper';

@Injectable()
export class MetricService {
  private readonly logger = new Logger(MetricService.name);

  constructor(private readonly klaviyoService: KlaviyoService) {}

  async getAllMetrics(params: ParamsHandlerDto): Promise<MetricsResponseDto> {
    this.logger.log('Fetching all metrics from Klaviyo');
    const metrics=await this.klaviyoService.getAllMetrics();
    return {
      data:metrics
    };
  }

  async getMetricCount(metricName: string): Promise<MetricCountResponseDto> {
    this.logger.log(`Fetching event count for metric: ${metricName}`);

    const metric = await this.klaviyoService.getMetricByName(metricName);
    const result = await this.klaviyoService.getEventsByMetric(metric.id);

    return {
      metricName,
      count: result.count,
    };
  }

  async getMetricEmails(
    metricName: string,
    date: string,
  ): Promise<MetricEmailsResponseDto> {
    this.logger.log(
      `Fetching emails for metric: ${metricName} on date: ${date}`,
    );

    const metric = await this.klaviyoService.getMetricByName(metricName);
    const result = await this.klaviyoService.getEventsByMetricAndDate(
      metric.id,
      date,
    );

    const emails = result.events
      .map((event) => event.relationships?.profile?.data?.id)
      .filter((email): email is string => !!email);

    const uniqueEmails = [...new Set(emails)];

    return {
      metricName,
      date,
      emails: uniqueEmails,
      count: uniqueEmails.length,
    };
  }
}
