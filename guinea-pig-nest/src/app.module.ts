import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoicesController } from './invoices/invoices.controller';
import { InvoicesService } from './invoices/invoices.service';
import { StorageService } from './storage/storage.service';
import { IdsService } from './ids/ids.service';

@Module({
  imports: [],
  controllers: [AppController, InvoicesController],
  providers: [AppService, InvoicesService, StorageService, IdsService],
})
export class AppModule {}
