import { BadRequestException } from '@nestjs/common';

export class ZodValidationException extends BadRequestException {
  constructor(objectOrError?: string | object | any, description?: string) {
    super(objectOrError, description);
  }
}
