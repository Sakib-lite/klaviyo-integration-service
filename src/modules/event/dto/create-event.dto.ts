import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    description: 'Name of the event (metric name in Klaviyo)',
    example: 'Placed Order',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @ApiProperty({
    description: 'Event-specific attributes/properties',
    example: {
      orderId: 'ORD-12345',
      amount: 99.99,
      currency: 'USD',
      items: ['Product A', 'Product B'],
    },
    type: Object,
  })
  @IsObject()
  @IsNotEmpty()
  eventAttributes: object;

  @ApiProperty({
    description: 'Profile attributes (must include email). Use snake_case for Klaviyo fields.',
    example: {
      email: 'customer@example.com',
      first_name: 'John',
      last_name: 'Doe',
      phone_number: '+1234567890',
    },
    type: Object,
  })
  @IsObject()
  @IsNotEmpty()
  profileAttributes: object;
}
