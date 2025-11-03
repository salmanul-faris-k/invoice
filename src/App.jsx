// App.jsx
import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import InvoiceDocument from './components/InvoiceDocument';
import InvoiceGenerator from './components/InvoicePDF';

function App() {
  return (
    <>
    <InvoiceGenerator/>
    </>
  );
}

export default App;