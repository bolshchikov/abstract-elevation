import { Module } from '@nestjs/common';
import { OpenTelemetryModule } from 'nestjs-otel';
import { IdsService } from '../ids/ids.service';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { StorageService } from '../storage/storage.service';

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true, // Includes Host Metrics
    apiMetrics: {
      enable: true, // Includes api metrics
      defaultAttributes: {
        // You can set default labels for api metrics
        custom: 'label',
      },
      ignoreRoutes: ['/favicon.ico'], // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
      ignoreUndefinedRoutes: false, //Records metrics for all URLs, even undefined ones
    },
  },
});

@Module({
  imports: [],
  controllers: [InvoicesController],
  providers: [InvoicesService, StorageService, IdsService],
})
export class InvoicesModule { }
