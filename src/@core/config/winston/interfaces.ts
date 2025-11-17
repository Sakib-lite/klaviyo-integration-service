import { LoggingEvents } from './constants';

export interface LogUserData {
  id: string | number;
  name?: string;
  email: string;
}

interface LogError {
  instance_of: string;
  stack: string[];
  status: number;
}

export interface LogEntry {
  event: LoggingEvents;
  message: string;
  '@timestamp'?: string;
  application?: string;
  error?: LogError;
  request_method?: string;
  request_uri?: string;
  network_logs?: string;
  user?: null | LogUserData;
  metadata?: any;
}
