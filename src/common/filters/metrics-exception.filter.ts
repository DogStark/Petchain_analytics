import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MetricsService } from '../metrics/metrics.service';

@Catch()
export class MetricsExceptionFilter implements ExceptionFilter {
  constructor(private readonly metricsService: MetricsService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorType = exception instanceof Error ? exception.constructor.name : 'Unknown';
    
    this.metricsService.incrementErrorCount(errorType);

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception instanceof Error ? exception.message : 'Internal server error',
    };

    response.status(status).json(errorResponse);
  }
}