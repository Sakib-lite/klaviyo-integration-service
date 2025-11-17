import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MetricService } from './metric.service';
import {
  MetricsResponseDto,
  MetricCountResponseDto,
  MetricEmailsResponseDto,
} from './dto/metric-response.dto';
import { PrivateBaseController } from '../../@core/etcs/base-controllers/private.base.controller';
import { ParamsHandlerDto } from '../../@core/dtos/params-handler.dto';

@ApiTags('Metrics')
@Controller('private/metrics')
export class MetricController extends PrivateBaseController {
  constructor(private readonly metricService: MetricService) {
    super();
  }

  @Get()
  @ApiOperation({
    summary: 'Get all metrics with pagination',
    description:
      'Retrieves all available metrics from Klaviyo with pagination and search support',
  })
  @ApiResponse({
    status: 200,
    description: 'Metrics retrieved successfully',
    type: MetricsResponseDto,
  })
  async getAllMetrics(
    @Query() params: ParamsHandlerDto,
  ): Promise<MetricsResponseDto> {
    return this.metricService.getAllMetrics(params);
  }

  @Get(':metric/count')
  @ApiOperation({
    summary: 'Get total event count for a metric',
    description: 'Returns the total number of events for a given metric name',
  })
  @ApiParam({
    name: 'metric',
    description: 'Metric name (e.g., "Active on Site")',
    example: 'Active on Site',
  })
  @ApiResponse({
    status: 200,
    description: 'Event count retrieved successfully',
    type: MetricCountResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Metric not found' })
  async getMetricCount(
    @Param('metric') metric: string,
  ): Promise<MetricCountResponseDto> {
    return this.metricService.getMetricCount(metric);
  }

  @Get(':metric/emails')
  @ApiOperation({
    summary: 'Get unique emails for a metric on a specific date',
    description:
      'Returns a list of unique email addresses associated with events for a given metric on a specific date',
  })
  @ApiParam({
    name: 'metric',
    description: 'Metric name (e.g., "Placed Order")',
    example: 'Placed Order',
  })
  @ApiQuery({
    name: 'date',
    description: 'Date in YYYY-MM-DD format',
    example: '2024-11-17',
  })
  @ApiResponse({
    status: 200,
    description: 'Emails retrieved successfully',
    type: MetricEmailsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Metric not found' })
  async getMetricEmails(
    @Param('metric') metric: string,
    @Query('date') date: string,
  ): Promise<MetricEmailsResponseDto> {
    return this.metricService.getMetricEmails(metric, date);
  }
}
