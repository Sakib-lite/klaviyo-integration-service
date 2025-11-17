import { UnauthorizedException } from '@nestjs/common';
import { HTTP_UNAUTHORIZED_TEXT_DEFAULT } from '../constants/text-constant';
export class HttpUnauthorizedError extends UnauthorizedException {
  constructor(message?: string, error?: any) {
    super(message || HTTP_UNAUTHORIZED_TEXT_DEFAULT, error);
  }
}
