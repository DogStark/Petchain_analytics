import { Module } from '@nestjs/common';
import { TerminusModule } from 
;
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { PrometheusModule } from './prometheus/prometheus.module';

@Module({
  imports: [
    TerminusModule,
    PrometheusModule,
  ],
  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}