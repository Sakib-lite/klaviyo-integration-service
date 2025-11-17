import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entity/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateBulkEventsDto } from './dto/create-bulk-events.dto';
import { KlaviyoService } from '../klaviyo/klaviyo.service';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private klaviyoService: KlaviyoService,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const event = this.eventRepository.create({
      eventName: createEventDto.eventName,
      eventAttributes: createEventDto.eventAttributes,
      profileAttributes: createEventDto.profileAttributes,
    });

    const savedEvent = await this.eventRepository.save(event);

    try {
     const k= await this.klaviyoService.createEvent(
        createEventDto.eventName,
        createEventDto.eventAttributes,
        createEventDto.profileAttributes,
      );
     console.log('k=>',k)
    } catch (error) {
      this.logger.warn(`Failed to send event to Klaviyo: ${error.message}`);
    }

    return {
      success: true,
      message: 'Event created successfully',
      data: {
        id: savedEvent.id,
        eventName: savedEvent.eventName,
        createdAt: savedEvent.createdAt,
      },
    };
  }

  async createBulk(createBulkEventsDto: CreateBulkEventsDto) {
    const events = createBulkEventsDto.events.map((dto) =>
      this.eventRepository.create({
        eventName: dto.eventName,
        eventAttributes: dto.eventAttributes,
        profileAttributes: dto.profileAttributes,
      }),
    );

    const savedEvents = await this.eventRepository.save(events);

    const klaviyoEvents = createBulkEventsDto.events.map((dto) => ({
      eventName: dto.eventName,
      eventAttributes: dto.eventAttributes,
      profileAttributes: dto.profileAttributes,
    }));

    try {
      await this.klaviyoService.createBulkEvents(klaviyoEvents);
    } catch (error) {
      this.logger.warn(`Failed to send bulk events to Klaviyo: ${error.message}`);
    }

    return {
      success: true,
      message: 'Bulk events created successfully',
      data: {
        created: savedEvents.length,
        failed: 0,
        details: savedEvents.map((event) => ({
          id: event.id,
          eventName: event.eventName,
          createdAt: event.createdAt,
        })),
      },
    };
  }
}
