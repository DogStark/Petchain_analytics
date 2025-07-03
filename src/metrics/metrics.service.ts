import { Injectable } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { PrometheusService } from './prometheus/prometheus.service';

@Injectable()
export class MetricsService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prometheusService: PrometheusService,
  ) {}

  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.prometheusService.getHealthStatus(),
    ]);
  }

  getMetrics(): Promise<string> {
    return this.prometheusService.getMetrics();
  }

  incrementRequestCount(method: string, route: string, statusCode: number) {
    this.prometheusService.incrementRequestCount(method, route, statusCode);
  }

  observeRequestDuration(method: string, route: string, duration: number) {
    this.prometheusService.observeRequestDuration(method, route, duration);
  }

  incrementErrorCount(errorType: string) {
    this.prometheusService.incrementErrorCount(errorType);
  }

  setActiveConnections(count: number) {
    this.prometheusService.setActiveConnections(count);
  }
}
