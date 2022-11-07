import axios from 'axios';

const SERVER_URL = 'http://localhost:4000';

export const getAllInvoices = async () => {
  const res = await axios.get(`${SERVER_URL}/invoices`);
  return res.data;
};

export const addNewInvoice = (dto) => {
  return axios.put(`${SERVER_URL}/invoices`, dto);
};