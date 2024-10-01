import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllHttpExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = this.getStatusCode(exception);

    const errorResponse = {
      status: false,
      message: this.getErrorMessage(exception),
      path: request.url,
      timestamp: new Date().toISOString(),
      data: null,
    };

    this.logger.error(`Error occurred: ${exception.message}`, exception.stack);
    response.status(statusCode).json(errorResponse);
  }

  private getStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    } else if (exception instanceof ValidationError) {
      return HttpStatus.BAD_REQUEST; // For validation errors
    } else {
      return HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500
    }
  }

  private getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const responseContent: any = exception.getResponse();
      return typeof responseContent === 'string'
        ? responseContent
        : responseContent?.message || 'Internal server error';
    } else if (exception instanceof ValidationError) {
      return Object.values(exception.constraints).join(', ');
    } else if (exception instanceof Error) {
      return exception.message || 'Internal server error';
    } else {
      return 'Unknown error occurred';
    }
  }
}
