import { Injectable } from '@nestjs/common';
import { register, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class PrometheusService {
  private readonly httpRequestsTotal: Counter<string>;
  private readonly httpRequestDuration: Histogram<string>;
  private readonly httpErrorsTotal: Counter<string>;
  private readonly activeConnections: Gauge<string>;
  private readonly memoryUsage: Gauge<string>;
  private readonly cpuUsage: Gauge<string>;

  constructor() {
    // Enable default metrics collection (CPU, memory, etc.)
    collectDefaultMetrics({ register });

    // HTTP request counter
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [register],
    });

    // HTTP request duration histogram
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route'],
      buckets: [0.1, 0.5, 1, 2, 5, 10],
      registers: [register],
    });

    // HTTP errors counter
    this.httpErrorsTotal = new Counter({
      name: 'http_errors_total',
      help: 'Total number of HTTP errors',
      labelNames: ['error_type'],
      registers: [register],
    });

    // Active connections gauge
    this.activeConnections = new Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
      registers: [register],
    });

    // Memory usage gauge
    this.memoryUsage = new Gauge({
      name: 'memory_usage_bytes',
      help: 'Memory usage in bytes',
      registers: [register],
    });

    // CPU usage gauge
    this.cpuUsage = new Gauge({
      name: 'cpu_usage_percent',
      help: 'CPU usage percentage',
      registers: [register],
    });

    // Start collecting system metrics
    this.startSystemMetricsCollection();
  }

  async getMetrics(): Promise<string> {
    return register.metrics();
  }

  async getHealthStatus() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  incrementRequestCount(method: string, route: string, statusCode: number) {
    this.httpRequestsTotal.inc({
      method,
      route,
      status_code: statusCode.toString(),
    });
  }

  observeRequestDuration(method: string, route: string, duration: number) {
    this.httpRequestDuration.observe(
      { method, route },
      duration / 1000, // Convert to seconds
    );
  }

  incrementErrorCount(errorType: string) {
    this.httpErrorsTotal.inc({ error_type: errorType });
  }

  setActiveConnections(count: number) {
    this.activeConnections.set(count);
  }

  private startSystemMetricsCollection() {
    // Collect memory and CPU metrics every 10 seconds
    setInterval(() => {
      const memUsage = process.memoryUsage();
      this.memoryUsage.set(memUsage.heapUsed);

      // CPU usage calculation (simplified)
      const cpuUsage = process.cpuUsage();
      const totalCpuTime = cpuUsage.user + cpuUsage.system;
      this.cpuUsage.set(totalCpuTime / 1000000); // Convert to seconds
    }, 10000);
  }
}