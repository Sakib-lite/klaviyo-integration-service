import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEventDto } from './create-event.dto';

export class CreateBulkEventsDto {
  @ApiProperty({
    description: 'Array of events to create',
    type: [CreateEventDto],
    example: [
      {
        eventName: 'Placed Order',
        eventAttributes: { orderId: 'ORD-001', amount: 99.99 },
        profileAttributes: { email: 'customer1@example.com', firstName: 'John' },
      },
      {
        eventName: 'Added to Cart',
        eventAttributes: { productId: 'PROD-123', quantity: 2 },
        profileAttributes: { email: 'customer2@example.com', firstName: 'Jane' },
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventDto)
  events: CreateEventDto[];
}
