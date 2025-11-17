import { ApiProperty } from '@nestjs/swagger';

export class ProfileAttributesDto {
  @ApiProperty({ example: 'customer@example.com' })
  email: string;

  @ApiProperty({ example: 'John', required: false })
  first_name?: string;

  @ApiProperty({ example: 'Doe', required: false })
  last_name?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  phone_number?: string;

  @ApiProperty({ example: { custom_field: 'custom_value' }, required: false })
  properties?: Record<string, any>;
}

export class ProfileAttributesResponseDto {
  @ApiProperty({ example: '01HQRS7YQMC3Q4X5Z6T8W9V0AB' })
  id: string;

  @ApiProperty({ type: ProfileAttributesDto })
  attributes: ProfileAttributesDto;
}

export class ProfileEventDto {
  @ApiProperty({ example: '01HQRS7YQMC3Q4X5Z6T8W9V0AB' })
  id: string;

  @ApiProperty({ example: 'event' })
  type: string;

  @ApiProperty({
    example: {
      timestamp: '2024-11-17T10:30:00Z',
      event_properties: {
        orderId: 'ORD-12345',
        amount: 99.99,
      },
      datetime: '2024-11-17T10:30:00Z',
    },
  })
  attributes: {
    timestamp: string;
    event_properties: Record<string, any>;
    datetime: string;
  };
}

export class ProfileMetricsResponseDto {
  @ApiProperty({ example: 'customer@example.com' })
  email: string;

  @ApiProperty({ type: [ProfileEventDto] })
  events: ProfileEventDto[];

  @ApiProperty({ example: 5 })
  totalEvents: number;
}
