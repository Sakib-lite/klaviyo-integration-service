import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(
    message: string = '',
    statusCode: number = HttpStatus.BAD_REQUEST,
  ) {
    super(message, statusCode);
  }
}
