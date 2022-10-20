import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from 'src/dto/create-invoice.dto';
import { IdsService } from 'src/ids/ids.service';
import { Invoice } from 'src/invoice';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class InvoicesService {
  constructor(
    private storageService: StorageService,
    private idsService: IdsService) { }

  async list(): Promise<Invoice[]> {
    return this.storageService.getInvoices();
  }
  add(invoiceDto: CreateInvoiceDto) {
    const newInvoice = new Invoice(invoiceDto);
    newInvoice.id = this.idsService.generateId();
    this.storageService.saveInvoice(newInvoice);
  }
}
