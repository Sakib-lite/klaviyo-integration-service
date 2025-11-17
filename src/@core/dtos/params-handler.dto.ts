import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class ParamsHandlerDto {
  @ApiProperty({
    required: false,
    description: 'Page number for pagination',
    type: Number,
    example: 1,
    default: 1,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    required: false,
    description: 'Number of items per page (max: 100)',
    type: Number,
    example: 10,
    default: 10,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    required: false,
    description:
      'Search term for global search across event names, profile emails, and metric names',
    type: String,
    example: 'Placed Order',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    description:
      'Filters in JSON format. Available types: includesString, greaterOrEqual, lessOrEqual, equals, notEquals, arrIncludes, isDateBetween, equalDateYear. Use for filtering events by metric, profiles by email, or date ranges.',
    type: String,
    example: '[{"column":"eventName","type":"includesString","value":"Order"}]',
  })
  @IsString()
  @IsOptional()
  filters?: string;

  @ApiProperty({
    required: false,
    description:
      'Sorting orders in JSON format. Direction can be ASC or DESC. Common columns: createdAt, eventName, email',
    type: String,
    example: '[{"column":"createdAt","direction":"DESC"}]',
  })
  @IsString()
  @IsOptional()
  orders?: string;

  @ApiProperty({
    required: false,
    description: 'Start date for date range filtering (format: YYYY-MM-DD). Used to filter events created on or after this date.',
    type: String,
    example: '2024-11-01',
  })
  @IsString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({
    required: false,
    description: 'End date for date range filtering (format: YYYY-MM-DD). Used to filter events created on or before this date.',
    type: String,
    example: '2024-11-17',
  })
  @IsString()
  @IsOptional()
  end_date?: string;
}
