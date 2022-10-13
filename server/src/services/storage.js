const inMemoryInvoices = [];

class StorageService {
  constructor(ctx) {
    this.context = ctx;
  }
  async getAllInvoices() {
    return inMemoryInvoices;
  }
  storeInvoice(invoice) {
    inMemoryInvoices.push(invoice);
  }
}

export default StorageService;