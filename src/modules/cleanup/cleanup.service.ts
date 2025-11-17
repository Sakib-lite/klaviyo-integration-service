import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Event } from '../event/entity/event.entity';
import { ConfigKey } from '../../@core/config/app-config/app-config';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);
  private readonly retentionDays: number;

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly configService: ConfigService,
  ) {
    this.retentionDays =
      this.configService.get<number>(ConfigKey.DATA_RETENTION_DAYS) ?? 7;
    this.logger.log(
      `Cleanup service initialized with ${this.retentionDays} days retention`,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleDailyCleanup() {
    this.logger.log('Starting daily cleanup job');

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);

      this.logger.log(
        `Deleting events older than ${cutoffDate.toISOString()} (${this.retentionDays} days ago)`,
      );

      const result = await this.eventRepository.delete({
        createdAt: LessThan(cutoffDate),
      });

      const deletedCount = result.affected || 0;

      this.logger.log(
        `Daily cleanup completed. Deleted ${deletedCount} event(s) older than ${this.retentionDays} days`,
      );

      return {
        success: true,
        deletedCount,
        cutoffDate: cutoffDate.toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to execute daily cleanup: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async manualCleanup(): Promise<{
    success: boolean;
    deletedCount: number;
    cutoffDate: string;
  }> {
    this.logger.log('Manual cleanup triggered');
    return this.handleDailyCleanup();
  }
}
