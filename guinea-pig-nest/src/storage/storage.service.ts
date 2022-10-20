import { Injectable } from '@nestjs/common';
import { Invoice } from 'src/invoice';

@Injectable()
export class StorageService {
  private readonly invoices: Invoice[] = [];
  getInvoices() {
    return this.invoices;
  }
  saveInvoice(invoice: Invoice) {
    this.invoices.push(invoice);
  }
}
