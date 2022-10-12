const Invoice = require('../models/Invoice');
const ids = require('../utils/ids');

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

module.exports = InvoicesService;