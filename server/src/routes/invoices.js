const express = require('express');
const router = express.Router();

router.get('/', async function (req, res, next) {
  const { invoicesService } = req.context;
  const listOfInvoices = await invoicesService.list();
  res.send(listOfInvoices);
});

router.put('/', async function (req, res, next) {
  const { name, amount } = req.body;
  const { invoicesService } = req.context;
  const newInvoice = await invoicesService.add(name, amount);
  res.send(`Invoice ${newInvoice.id} for ${newInvoice.amount} is added`);
});

module.exports = router;
