import React, { useState } from 'react';
import { addNewInvoice } from '../services/api';

const NewInvoice = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const setNameHandler = ({ target }) => {
    setName(target.value);
  };
  const setAmountHandler = ({ target }) => {
    setAmount(target.value);
  };
  const submitHandler = async () => {
    await addNewInvoice({
      name, amount
    });
  }
  return (
    <>
      <h2>Add Invoice</h2>
      <div>
        <form>
          <div>
            <input value={name} onChange={setNameHandler} type="text" placeholder="Enter invoice name" />
          </div>
          <div>
            <input value={amount} onChange={setAmountHandler} type="number" placeholder="Enter invoice amount" />
          </div>
          <div>
            <button onClick={submitHandler}>Add</button>
          </div>
        </form>
      </div>
    </>
  )
};

export default NewInvoice;
