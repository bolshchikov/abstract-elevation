import './App.css';
import InvoicesList from './components/InvoicesList';
import NewInvoice from './components/NewInvoice';

function App() {
  return (
    <>
      <h1>Invoices</h1>
      <div className="app">
        <section className="main">
          <InvoicesList />
        </section>
        <section className="form">
          <NewInvoice />
        </section>
      </div>
    </>
  );
}

export default App;
