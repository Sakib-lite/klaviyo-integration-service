import { Injectable, Logger } from '@nestjs/common';
import { KlaviyoService } from '../klaviyo/klaviyo.service';
import {
  ProfileAttributesResponseDto,
  ProfileMetricsResponseDto,
} from './dto/profile-response.dto';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly klaviyoService: KlaviyoService) {}

  async getProfileAttributes(
    email: string,
  ): Promise<ProfileAttributesResponseDto> {
    this.logger.log(`Fetching profile attributes for email: ${email}`);

    const profile = await this.klaviyoService.getProfileByEmail(email);

    return {
      id: profile.id,
      attributes: profile.attributes,
    };
  }

  async getProfileMetrics(email: string): Promise<ProfileMetricsResponseDto> {
    this.logger.log(`Fetching profile metrics for email: ${email}`);

    const profile = await this.klaviyoService.getProfileByEmail(email);
    const events = await this.klaviyoService.getProfileMetrics(profile.id);

    const mappedEvents = events.map((event) => ({
      id: event.id,
      type: event.type,
      attributes: {
        timestamp: new Date(event.attributes.timestamp * 1000).toISOString(),
        event_properties: event.attributes.event_properties,
        datetime: event.attributes.datetime,
      },
    }));

    return {
      email,
      events: mappedEvents,
      totalEvents: events.length,
    };
  }
}
