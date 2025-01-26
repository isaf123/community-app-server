import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { error } from 'console';
import { ZodError } from 'zod';
@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        error: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      const validationError = exception.errors[0].message;

      response.status(400).json({
        error: validationError,
      });
    } else {
      response.status(500).json({
        error: exception.message,
      });
    }
  }
}
