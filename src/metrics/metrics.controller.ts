import { Controller, Get, Header } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { HealthCheck } from '@nestjs/terminus';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  async getMetrics(): Promise<string> {
    return this.metricsService.getMetrics();
  }

  @Get('health')
  @HealthCheck()
  async getHealth() {
    return this.metricsService.check();
  }
}
