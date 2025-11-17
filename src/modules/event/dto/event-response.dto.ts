import { ApiProperty } from '@nestjs/swagger';

export class EventDataDto {
  @ApiProperty({ example: 1 })
  id?: number;

  @ApiProperty({ example: 'Placed Order' })
  eventName?: string;

  @ApiProperty({ example: '2024-11-17T10:30:00.000Z' })
  createdAt?: Date;

  @ApiProperty({ example: { orderId: 'ORD-12345' } })
  eventAttributes?: object;

  @ApiProperty({ example: { email: 'customer@example.com' } })
  profileAttributes?: object;
}

export class EventResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Event created successfully' })
  message: string;

  @ApiProperty({ type: EventDataDto })
  data: EventDataDto | any;
}

export class BulkEventResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Bulk events created successfully' })
  message: string;

  @ApiProperty({
    example: {
      created: 2,
      failed: 0,
      details: [],
    },
  })
  data: {
    created: number;
    failed: number;
    details: any[];
  };
}
