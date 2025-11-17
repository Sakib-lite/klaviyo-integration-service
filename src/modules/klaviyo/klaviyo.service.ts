import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { ConfigKey } from '../../@core/config/app-config/app-config';
import {
  KlaviyoEventPayload,
  KlaviyoMetric,
  KlaviyoProfile,
  KlaviyoEvent,
} from './interfaces/klaviyo.interface';

@Injectable()
export class KlaviyoService {
  private readonly logger = new Logger(KlaviyoService.name);
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.apiKey =
      this.configService.get<string>(ConfigKey.KLAVIYO_API_KEY) ?? '';
    this.apiUrl =
      this.configService.get<string>(ConfigKey.KLAVIYO_API_URL) ?? '';

    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
      headers: {
        Authorization: `Klaviyo-API-Key ${this.apiKey}`,
        'Content-Type': 'application/json',
        revision: '2024-10-15',
      },
    });

    this.logger.log(
      `Klaviyo service initialized successfully. API URL: ${this.apiUrl}`,
    );
  }

  async createEvent(
    eventName: string,
    eventAttributes: object,
    profileAttributes: object,
  ): Promise<any> {
    try {
      const payload: KlaviyoEventPayload = {
        data: {
          type: 'event',
          attributes: {
            properties: eventAttributes,
            metric: {
              data: {
                type: 'metric',
                attributes: {
                  name: eventName,
                },
              },
            },
            profile: {
              data: {
                type: 'profile',
                attributes: profileAttributes,
              },
            },
          },
        },
      };

      this.logger.log(
        `Sending event to Klaviyo: ${JSON.stringify(payload, null, 2)}`,
      );

      const response = await this.axiosInstance.post('/events', payload);

      this.logger.log(
        `Event accepted by Klaviyo. Status: ${response.status}, Event: ${eventName}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to create event: ${error.message}`);
      throw new HttpException(
        `Failed to send event to Klaviyo: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createBulkEvents(
    events: Array<{
      eventName: string;
      eventAttributes: object;
      profileAttributes: object;
    }>,
  ): Promise<any> {
    try {
      const payload = {
        data: events.map((event) => ({
          type: 'event',
          attributes: {
            properties: event.eventAttributes,
            metric: {
              data: {
                type: 'metric',
                attributes: {
                  name: event.eventName,
                },
              },
            },
            profile: {
              data: {
                type: 'profile',
                attributes: event.profileAttributes,
              },
            },
          },
        })),
      };

      const response = await this.axiosInstance.post(
        '/event-bulk-create',
        payload,
      );

      this.logger.log(`Bulk events created: ${events.length} events`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to create bulk events: ${error.message}`);
      throw new HttpException(
        `Failed to send bulk events to Klaviyo: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllMetrics(): Promise<KlaviyoMetric[]> {
    try {
      const response = await this.axiosInstance.get('/metrics');

      this.logger.log(`Retrieved ${response.data.data?.length || 0} metrics`);
      return response.data.data;
    } catch (error) {
      this.logger.error(`Failed to get metrics: ${error.message}`);
      throw new HttpException(
        `Failed to retrieve metrics from Klaviyo: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMetricByName(metricName: string): Promise<KlaviyoMetric> {
    try {
      const metrics = await this.getAllMetrics();
      const metric = metrics.find((m) => m.attributes.name === metricName);

      if (!metric) {
        throw new HttpException(
          `Metric '${metricName}' not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return metric;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Failed to get metric by name: ${error.message}`);
      throw new HttpException(
        `Failed to retrieve metric from Klaviyo: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getEventsByMetric(
    metricId: string,
  ): Promise<{ events: KlaviyoEvent[]; count: number }> {
    try {
      const params = new URLSearchParams({
        filter: `equals(metric_id,"${metricId}")`,
        include: 'metric,profile',
      });

      const response = await this.axiosInstance.get(
        `/events?${params.toString()}`,
      );

      const events = response.data.data || [];
      this.logger.log(`Retrieved ${events.length} events for metric ${metricId}`);

      return {
        events,
        count: events.length,
      };
    } catch (error) {
      this.logger.error(`Failed to get events by metric: ${error.message}`);
      throw new HttpException(
        `Failed to retrieve events from Klaviyo: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getEventsByMetricAndDate(
    metricId: string,
    date: string,
  ): Promise<{ events: KlaviyoEvent[]; count: number }> {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const params = new URLSearchParams({
        filter: `equals(metric_id,"${metricId}"),greater-or-equal(datetime,${startDate.toISOString()}),less-or-equal(datetime,${endDate.toISOString()})`,
        include: 'metric,profile',
      });

      const response = await this.axiosInstance.get(
        `/events?${params.toString()}`,
      );

      const events = response.data.data || [];
      this.logger.log(
        `Retrieved ${events.length} events for metric ${metricId} on ${date}`,
      );

      return {
        events,
        count: events.length,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get events by metric and date: ${error.message}`,
      );
      throw new HttpException(
        `Failed to retrieve events from Klaviyo: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProfileByEmail(email: string): Promise<KlaviyoProfile> {
    try {
      const params = new URLSearchParams({
        filter: `equals(email,"${email}")`,
      });

      const response = await this.axiosInstance.get(
        `/profiles?${params.toString()}`,
      );

      const profiles = response.data.data || [];
      if (profiles.length === 0) {
        throw new HttpException(
          `Profile with email '${email}' not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      this.logger.log(`Retrieved profile for email: ${email}`);
      return profiles[0];
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Failed to get profile: ${error.message}`);
      throw new HttpException(
        `Failed to retrieve profile from Klaviyo: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProfileMetrics(profileId: string): Promise<KlaviyoEvent[]> {
    try {
      const response = await this.axiosInstance.get(
        `/profiles/${profileId}/events`,
      );

      const events = response.data.data || [];
      this.logger.log(
        `Retrieved ${events.length} events for profile ${profileId}`,
      );
      return events;
    } catch (error) {
      this.logger.error(`Failed to get profile metrics: ${error.message}`);
      throw new HttpException(
        `Failed to retrieve profile metrics from Klaviyo: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
