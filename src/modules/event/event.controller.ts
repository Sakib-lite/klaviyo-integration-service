import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateBulkEventsDto } from './dto/create-bulk-events.dto';
import {
  EventResponseDto,
  BulkEventResponseDto,
} from './dto/event-response.dto';
import {
  createEventRequestExamples,
  createEventResponseExamples,
  createBulkEventsRequestExamples,
  createBulkEventsResponseExamples,
} from './examples/event.examples';
import { PrivateBaseController } from '../../@core/etcs/base-controllers/private.base.controller';

@ApiTags('Events')
@Controller('private/events')
export class EventController extends PrivateBaseController {
  constructor(private readonly eventService: EventService) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a single event',
    description:
      'Creates an event in the database and sends it to Klaviyo. The event is saved locally regardless of Klaviyo API status.',
  })
  @ApiBody({ type: CreateEventDto, examples: createEventRequestExamples })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    type: EventResponseDto,
    examples: createEventResponseExamples,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create multiple events in bulk',
    description:
      'Creates multiple events in the database and sends them to Klaviyo in a single batch. All events are saved locally regardless of Klaviyo API status.',
  })
  @ApiBody({
    type: CreateBulkEventsDto,
    examples: createBulkEventsRequestExamples,
  })
  @ApiResponse({
    status: 201,
    description: 'Bulk events created successfully',
    type: BulkEventResponseDto,
    examples: createBulkEventsResponseExamples,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  async createBulk(@Body() createBulkEventsDto: CreateBulkEventsDto) {
    return this.eventService.createBulk(createBulkEventsDto);
  }
}
