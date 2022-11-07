import './InvoicesList.css';
import React, { useState, useEffect } from 'react';
import { getAllInvoices } from '../services/api';

const InvoiceList = () => {
  const [invoices, setInvoice] = useState([]);

  useEffect(() => {
    getAllInvoices().then(setInvoice);
  }, []);

  return (
    <>
      <h2>List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(({ name, amount }, idx) => (
            <tr key={idx}>
              <td>{name}</td>
              <td>${amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
};

export default InvoiceList;
