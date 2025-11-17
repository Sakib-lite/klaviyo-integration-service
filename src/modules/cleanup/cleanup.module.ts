import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CleanupService } from './cleanup.service';
import { Event } from '../event/entity/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [CleanupService],
  exports: [CleanupService],
})
export class CleanupModule {}
