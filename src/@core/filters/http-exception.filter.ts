import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AxiosError } from 'axios';
import { LogEntry, LogUserData } from '../config/winston/interfaces';
import { LoggingEvents } from '../config/winston/constants';
import { IAuthUser } from '../interfaces/users';
import { ZodValidationException } from '../exceptions/zod-validation.error';
import { ThrottlerException } from '@nestjs/throttler';

interface ResponseObject {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  dev_note?: string;
  errors?: any;
}

function stackTraceToArray(stack: string | undefined) {
  if (!stack) {
    return [];
  }
  return stack.split('\n');
}
@Catch(
  HttpException,
  AxiosError,
  ThrottlerException,
  ZodValidationException,
  Error,
)
export class AllHttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request & { authUser: IAuthUser }>();
    const { authUser } = request;

    const responseObject: ResponseObject = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Internal server error',
    };

    let userInfo: LogUserData | null = null;
    if (authUser) {
      userInfo = {
        id: authUser.id,
        email: authUser.email,
      };
    }

    const logEntry: LogEntry = {
      event: LoggingEvents.GlobalError,
      message: exception.message,
      request_method: request.method,
      request_uri: request.url,
      user: userInfo,
      error: {
        instance_of: exception.name,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        stack: stackTraceToArray(exception?.stack) || [],
      },
      metadata: {
        body: request.body,
        headers: {
          content_length: request.headers['content-length'],
          user_agent: request.headers['user-agent'],
          origin: request.headers['origin'],
          referer: request.headers['referer'],
          accept: request.headers['accept'],
        },
      },
    };

    try {
      if (exception instanceof HttpException) {
        console.log('exception=>', exception);
        if (logEntry.error) {
          logEntry.error.status = exception.getStatus();
        }
      }

      if (exception instanceof AxiosError) {
        logEntry.network_logs = ``;
        if (exception.config) {
          logEntry.network_logs = `${exception.config?.method || 'unknown'} ${
            exception.config?.url || 'unknown'
          }`;
        }
        if (exception.response) {
          logEntry.network_logs += `${exception.response?.status} ${exception.response?.statusText}`;
        }
      } else if (exception instanceof ZodValidationException) {
        const exceptionResponse: any = exception.getResponse();
        const errors: Record<string, string[]> = {};
        (exceptionResponse?.message || []).forEach((message: any) => {
          try {
            const re = new RegExp('^\\"[^"]+\\"');
            const matches = re.exec(message);
            if (matches && matches[0]) {
              const fieldName = matches[0].replace(/"/g, '');
              if (!errors[fieldName]) {
                errors[fieldName] = [];
              }
              errors[fieldName].push(message);
            }
          } catch (e) {
            console.error(e);
          }
        });
        if (errors && Object.keys(errors).length) {
          responseObject.errors = errors;
        }
        responseObject.message = exception.message;
        responseObject.statusCode = HttpStatus.BAD_REQUEST;
      }

      responseObject.dev_note = exception.toString();

      const cacheControlHeader: any = response.getHeader('Cache-Control');
      if (cacheControlHeader) {
        response.set('Cache-Control', 'no-cache');
      }

      if (exception?.message) {
        responseObject.message = exception?.message;
      }

      if (exception?.status) {
        responseObject.statusCode = exception.status;
      }

      if (exception instanceof ThrottlerException) {
        console.log('ThrottlerException Error', exception);
      }
      Logger.error(logEntry, '', exception.name);
      return response.status(responseObject.statusCode).json(responseObject);
    } catch (e) {
      Logger.error(logEntry, '', exception.name);
      return response.status(responseObject.statusCode).json(responseObject);
    }
  }
}
