import { ApiProperty } from '@nestjs/swagger';

export class MetricDto {
  @ApiProperty({ example: '01HQRS7YQMC3Q4X5Z6T8W9V0AB' })
  id: string;

  @ApiProperty({ example: 'metric' })
  type: string;

  @ApiProperty({
    example: {
      name: 'Placed Order',
      created: '2024-01-15T10:30:00Z',
      updated: '2024-01-15T10:30:00Z',
      integration: {
        object: 'integration',
        id: '01HQRS7YQMC3Q4X5Z6T8W9V0AB',
        name: 'API',
        category: 'Custom',
      },
    },
  })
  attributes: {
    name: string;
    created: string;
    updated: string;
    integration: {
      object: string;
      id: string;
      name: string;
      category: string;
    };
  };
}

export class PaginationMetaDto {
  @ApiProperty({ example: 50 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

export class MetricsResponseDto {
  @ApiProperty({ type: [MetricDto] })
  data: MetricDto[];
}

export class MetricCountResponseDto {
  @ApiProperty({ example: 'Active on Site' })
  metricName: string;

  @ApiProperty({ example: 42 })
  count: number;
}

export class MetricEmailsResponseDto {
  @ApiProperty({ example: 'Placed Order' })
  metricName: string;

  @ApiProperty({ example: '2024-11-17' })
  date: string;

  @ApiProperty({
    example: ['customer1@example.com', 'customer2@example.com'],
    type: [String],
  })
  emails: string[];

  @ApiProperty({ example: 2 })
  count: number;
}
