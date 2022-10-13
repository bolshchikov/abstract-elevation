import Invoice from '../models/Invoice.js';
import ids from '../utils/ids.js';

class InvoicesService {
  constructor(ctx) {
    this.context = ctx;
  }
  async list() {
    const { storageService } = this.context;
    return storageService.getAllInvoices();
  }
  async add(name, amount) {
    const { storageService } = this.context;
    const newInvoice = new Invoice(ids.generate(), { name, amount });
    storageService.storeInvoice(newInvoice);
    return newInvoice;
  }
}

export default InvoicesService;