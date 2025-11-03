import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X } from 'lucide-react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import NotoSans from '../assets/fonts/NotoSans-Regular.ttf';
import NotoSansItalic from '../assets/fonts/NotoSans-Italic.ttf';
import Logo from '../assets/logo.png';
import QRImage from '../assets/qr-code.jpg';
import sigin from '../assets/signature.png';

// The PDF generation part does not need to be responsive, as it targets a fixed page size (A4).
// All styles here remain the same.
Font.register({
  family: 'NotoSans',
  fonts: [
    { src: NotoSans }, // Regular font
    { src: NotoSansItalic, fontStyle: 'italic' }, // Italic font
  ],
});

// Currency formatter
const formatINR = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value);

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'NotoSans',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  companyInfo: {
    color: '#fff',
    fontSize: 8,
    textAlign: 'right',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  sectionHeader: {
    backgroundColor: '#000',
    color: '#fff',
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 3,
  },
  billToSection: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 9,
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 3,
    width: '48%',
  },
  invoiceDetails: {
    marginTop: 5,
    marginBottom: 5,
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 3,
    width: '48%',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
    fontSize: 9,
    justifyContent: 'space-between',
  },
  table: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#000',
    color: '#fff',
    padding: 10,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 10,
    minHeight: 35,
    backgroundColor: '#fff',
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 10,
    minHeight: 35,
    backgroundColor: '#f9fafb',
  },
  col1: { width: '5%', fontSize: 9, color: '#374151' },
  col2: { width: '50%', fontSize: 9, color: '#374151' },
  col3: { width: '15%', textAlign: 'center', fontSize: 9, color: '#374151' },
  col4: { width: '15%', textAlign: 'right', fontSize: 9, color: '#374151' },
  col5: { width: '15%', textAlign: 'right', fontSize: 9, color: '#1f2937', fontWeight: 'bold' },
  colHeader: { fontSize: 10, color: '#fff' },
  totalSection: {
    marginTop: 10,
    alignItems: 'flex-end',
    borderTopWidth: 2,
    borderTopColor: '#000',
    paddingTop: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    padding: 5,
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  footerSection: {
    width: '48%',
  },
  footerHeader: {
    backgroundColor: '#1f2937',
    color: '#fff',
    padding: 6,
    marginBottom: 6,
    fontSize: 9,
    fontWeight: 'bold',
    borderRadius: 3,
  },
  footerText: {
    fontSize: 8,
    marginBottom: 2,
    color: '#374151',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  amountRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fef3c7',
    padding: 6,
    marginTop: 4,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  bankSection: {
    flexDirection: 'row',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 3,
  },
  qrBox: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  signatureSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  signatureLine: {
    paddingTop: 6,
    marginTop: 35,
    width: 140,
    alignItems: 'center',
  },
  termsBox: {
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 3,
    marginTop: 4,
  },
});

// Generate random invoice number
function generateRandomInvoiceNo() {
  const randomNum = Math.floor(100000 + Math.random() * 900000); // 6 digit random number
  return `INV-${randomNum}`;
}

// PDF Document Component (Unchanged)
const InvoicePDF = ({ invoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page} wrap>
      {/* Header */}
      <View style={styles.header} fixed>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Image src={Logo} style={{ width: 40, height: 40, objectFit: 'contain' }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>zyber</Text>
            <Text style={{ color: '#4CAF50', fontSize: 14, fontWeight: 'bold' }}>ad</Text>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>s</Text>
          </View>
        </View>

        <View style={styles.companyInfo}>
          <Text>Karukappilly-Mamangalam Road, Elamakkara</Text>
          <Text>Kochi - 682026, Ernakulam, Kerala</Text>
          <Text>Phone: 8089600171</Text>
          <Text>Email: adszyber@gmail.com</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Invoice for {invoiceData.month}</Text>

      {/* Bill To Section */}
      <View style={styles.sectionHeader}>
        <Text>BILL TO</Text>
        <Text>INVOICE DETAILS</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
        <View style={styles.billToSection}>
          <Text style={{ marginBottom: 3, fontWeight: 'bold', fontSize: 10 }}>
            {invoiceData.billTo.name || 'Client Name'}
          </Text>
          <Text style={{ color: '#6b7280' }}>
            {invoiceData.billTo.address || 'Address'}
          </Text>
        </View>

        <View style={styles.invoiceDetails}>
          <View style={styles.detailRow}>
            <Text style={{ fontSize: 9, fontWeight: 'bold' }}>Invoice No:</Text>
            <Text style={{ fontSize: 9 }}>{invoiceData.invoiceNo}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={{ fontSize: 9, fontWeight: 'bold' }}>Date:</Text>
            <Text style={{ fontSize: 9 }}>{invoiceData.date}</Text>
          </View>
        </View>
      </View>

      {/* Items Table */}
      {invoiceData.items && invoiceData.items.length > 0 && (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.col1, styles.colHeader]}>#</Text>
            <Text style={[styles.col2, styles.colHeader]}>Item Description</Text>
            <Text style={[styles.col3, styles.colHeader]}>Qty</Text>
            <Text style={[styles.col4, styles.colHeader]}>Rate</Text>
            <Text style={[styles.col5, styles.colHeader]}>Amount</Text>
          </View>
          {invoiceData.items.map((item, index) => (
            <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <Text style={styles.col1}>{index + 1}</Text>
              <Text style={styles.col2}>{item.name}</Text>
              <Text style={styles.col3}>{item.quantity}</Text>
              <Text style={styles.col4}>{formatINR(item.rate)}</Text>
              <Text style={styles.col5}>{formatINR(item.amount)}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Total */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={{ fontSize: 11, fontWeight: 'bold' }}>Total (INR)</Text>
          <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{formatINR(invoiceData.total)}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer} wrap={false}>
        {/* Left: Amount in Words, Terms, Bank */}
        <View style={styles.footerSection}>
          <View style={styles.footerHeader}>
            <Text>AMOUNT IN WORDS</Text>
          </View>
          <Text style={[styles.footerText, { fontWeight: 'bold', fontSize: 9, marginBottom: 8 }]}>
            {invoiceData.amountInWords}
          </Text>

          <View style={styles.footerHeader}>
            <Text>TERMS AND CONDITIONS</Text>
          </View>
          <View style={styles.termsBox}>
            <Text style={styles.footerText}>• Payment is due within 30 days</Text>
            <Text style={styles.footerText}>• Please include invoice number with payment</Text>
            <Text style={[styles.footerText, { marginTop: 4, fontStyle: 'italic' }]}>
              Thanks for doing business with us!
            </Text>
          </View>

          <View style={[styles.footerHeader, { marginTop: 10 }]}>
            <Text>BANK DETAILS</Text>
          </View>
          <View style={styles.bankSection}>
            <View style={styles.qrBox}>
              <Image src={QRImage} style={{ width: 55, height: 55, borderRadius: 3 }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.footerText, { fontWeight: 'bold', marginBottom: 4 }]}>
                Account Holder: Arshid
              </Text>
              <Text style={styles.footerText}>UPI ID: arshiarshid32@oksbi</Text>
              <Text style={styles.footerText}>Phone: 7510221817</Text>
            </View>
          </View>
        </View>

        {/* Right: Payment Summary & Signature */}
        <View style={styles.footerSection}>
          <View style={styles.footerHeader}>
            <Text>PAYMENT SUMMARY</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.footerText}>Subtotal</Text>
            <Text style={[styles.footerText, { fontWeight: 'bold' }]}>{formatINR(invoiceData.total)}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.footerText}>Total</Text>
            <Text style={[styles.footerText, { fontWeight: 'bold' }]}>{formatINR(invoiceData.total)}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.footerText}>Received</Text>
            <Text style={[styles.footerText, { color: '#059669', fontWeight: 'bold' }]}>
              {formatINR(invoiceData.received)}
            </Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.footerText}>Adjustments</Text>
            <Text style={[styles.footerText, { fontWeight: 'bold' }]}>{formatINR(invoiceData.adjustments)}</Text>
          </View>
          <View style={styles.amountRowFinal}>
            <Text style={[styles.footerText, { fontWeight: 'bold', fontSize: 9 }]}>Balance Due</Text>
            <Text style={[styles.footerText, { fontWeight: 'bold', fontSize: 9 }]}>
              {formatINR(invoiceData.balance)}
            </Text>
          </View>

          <View style={[styles.signatureSection, { alignItems: 'flex-start', marginTop: 40 }]}>
            <Text style={{ fontSize: 9, marginBottom: 8, color: '#6b7280' }}>For: zyberads</Text>

            {/* Larger, well-aligned signature */}
            <Image
              src={sigin}
              style={{
                width: 140,
                height: 140,
                marginTop: -40,
                marginRight: 10,
                objectFit: 'contain'
              }}
            />

            <View style={[styles.signatureLine, { width: 160, marginTop: -40 }]}>
              <Text style={{ fontSize: 9, fontWeight: 'bold' }}>Authorized Signatory</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

// Main Component (with Responsive UI)
export default function InvoiceGenerator() {
  const getCurrentMonth = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[new Date().getMonth()];
  };

  const [invoiceData, setInvoiceData] = useState(null);
  const [showItemsTable, setShowItemsTable] = useState(false);

  // Initialize invoiceData with random invoice number
  useEffect(() => {
    setInvoiceData({
      invoiceNo: generateRandomInvoiceNo(),
      date: new Date().toISOString().split('T')[0],
      month: getCurrentMonth(),
      billTo: { name: '', address: '' },
      items: [],
      adjustments: 0,
      received: 0,
    });
  }, []);

  // Remove item with functional update
  const removeItem = useCallback((index) => {
    setInvoiceData(prev => {
      if (!prev || !prev.items || prev.items.length === 0) return prev;
      const newItems = prev.items.filter((_, i) => i !== index);
      if (newItems.length === 0) {
        setShowItemsTable(false);
      }
      return { ...prev, items: newItems };
    });
  }, []);

  // Update item with functional update
  const updateItem = useCallback((index, field, value) => {
    setInvoiceData(prev => {
      if (!prev) return prev;
      const newItems = [...prev.items];
      const numValue = ['quantity', 'rate'].includes(field) ? parseFloat(value) || 0 : value;
      newItems[index][field] = numValue;
      if (field === 'quantity' || field === 'rate') {
        newItems[index].amount = newItems[index].quantity * newItems[index].rate;
      }
      return { ...prev, items: newItems };
    });
  }, []);

  // Add first item
  const addFirstItem = useCallback(() => {
    setInvoiceData(prev => ({
      ...prev,
      items: [{ name: '', quantity: 1, rate: 100, amount: 100 }]
    }));
    setShowItemsTable(true);
  }, []);

  // Generate new invoice with new random invoice number
  const generateNewInvoice = useCallback(() => {
    setInvoiceData({
      invoiceNo: generateRandomInvoiceNo(),
      date: new Date().toISOString().split('T')[0],
      month: getCurrentMonth(),
      billTo: { name: '', address: '' },
      items: [],
      adjustments: 0,
      received: 0,
    });
    setShowItemsTable(false);
  }, []);

  // Calculate totals
  const calculateTotal = useCallback((items) => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  }, []);

  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + ' ' + ones[num % 10];
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred ' + numberToWords(num % 100);
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand ' + numberToWords(num % 1000);
    return numberToWords(Math.floor(num / 100000)) + ' Lakh ' + numberToWords(num % 100000);
  };

  // Don't render until invoiceData is loaded
  if (!invoiceData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading invoice...</p>
      </div>
    );
  }

  const total = calculateTotal(invoiceData.items);
  const balance = total - invoiceData.adjustments - invoiceData.received;

  const pdfData = {
    ...invoiceData,
    date: formatDateToDDMMYYYY(invoiceData.date),
    total,
    balance,
    amountInWords: numberToWords(Math.floor(balance)) + ' Rupees Only',
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    // RESPONSIVE: Added responsive padding
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8">

        {/* Header */}
        {/* RESPONSIVE: flex-col on mobile, flex-row on medium screens and up. Items aligned to start. */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 pb-6 border-b-2 border-purple-200">
          {/* RESPONSIVE: Margin bottom on mobile to create space when stacked */}
          <div className="flex-1 mb-6 md:mb-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Invoice</h1>
            <p className="text-gray-500">Create professional invoices</p>
          </div>

          {/* RESPONSIVE: Full width on mobile */}
          <div className="bg-gray-50 p-4 md:p-6 rounded-lg border-2 border-gray-200 w-full md:w-auto">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <label className="text-sm font-bold text-gray-700 text-right">Invoice No:</label>
                <span className="text-sm font-semibold text-purple-600">{invoiceData.invoiceNo}</span>

                <label className="text-sm font-bold text-gray-700 text-right">Date:</label>
                <span className="text-sm text-gray-800">{formatDateToDDMMYYYY(invoiceData.date)}</span>
              </div>

              <div className="flex items-center gap-4 pt-2 border-t border-gray-300">
                <label className="text-sm font-medium text-gray-700">Month:</label>
                <select
                  value={invoiceData.month}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, month: e.target.value }))}
                  className="border-2 border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:border-purple-500 focus:outline-none transition bg-white"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Billed To */}
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-600 rounded"></span>
            Billed To
          </h3>
          <div className="grid grid-cols-1 gap-3 bg-gray-50 p-4 md:p-6 rounded-lg border-2 border-gray-200">
            <input
              type="text"
              placeholder="Client Name"
              value={invoiceData.billTo.name}
              onChange={(e) => setInvoiceData(prev => ({
                ...prev,
                billTo: { ...prev.billTo, name: e.target.value }
              }))}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none transition"
            />
            <input
              type="text"
              placeholder="Address"
              value={invoiceData.billTo.address}
              onChange={(e) => setInvoiceData(prev => ({
                ...prev,
                billTo: { ...prev.billTo, address: e.target.value }
              }))}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Items Section */}
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-600 rounded"></span>
            Items
          </h3>

          {!showItemsTable || invoiceData.items.length === 0 ? (
            <button
              onClick={addFirstItem}
              className="w-full border-2 border-dashed border-purple-300 rounded-lg py-8 text-purple-600 hover:bg-purple-50 hover:border-purple-400 transition flex items-center justify-center gap-2 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Add First Item
            </button>
          ) : (
            <>
              {/* RESPONSIVE TABLE WRAPPER */}
              <div className="overflow-x-auto rounded-lg border-2 border-gray-200">
                <table className="w-full">
                  {/* RESPONSIVE: Hide table head on mobile, show on medium+ */}
                  <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hidden md:table-header-group">
                    <tr>
                      <th className="px-4 py-4 text-left font-semibold">Item Description</th>
                      <th className="px-4 py-4 text-center font-semibold w-24">Qty</th>
                      <th className="px-4 py-4 text-right font-semibold w-32">Rate</th>
                      <th className="px-4 py-4 text-right font-semibold w-32">Amount</th>
                      <th className="px-4 py-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item, index) => (
                      // RESPONSIVE: Each row is a block on mobile, a table-row on medium+
                      <tr key={index} className={`block md:table-row border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-purple-50 transition`}>
                        {/* RESPONSIVE: Each cell is a block with padding. A label is shown on mobile. */}
                        <td className="block md:table-cell px-4 py-3 md:py-3" data-label="Item">
                          <span className="font-bold text-gray-600 md:hidden">Item: </span>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(index, 'name', e.target.value)}
                            placeholder="Item description"
                            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:outline-none transition mt-1 md:mt-0"
                          />
                        </td>
                        <td className="block md:table-cell px-4 py-3 md:py-3 md:text-center" data-label="Qty">
                          <span className="font-bold text-gray-600 md:hidden">Quantity: </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                            className="w-full md:w-24 border-2 border-gray-300 rounded-lg px-3 py-2 text-left md:text-center focus:border-purple-500 focus:outline-none transition mt-1 md:mt-0"
                          />
                        </td>
                        <td className="block md:table-cell px-4 py-3 md:py-3 md:text-right" data-label="Rate">
                          <span className="font-bold text-gray-600 md:hidden">Rate: </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={item.rate}
                            onChange={(e) => updateItem(index, 'rate', e.target.value)}
                            className="w-full md:w-32 border-2 border-gray-300 rounded-lg px-3 py-2 text-left md:text-right focus:border-purple-500 focus:outline-none transition mt-1 md:mt-0"
                          />
                        </td>
                        <td className="block md:table-cell px-4 py-3 md:py-3 text-left md:text-right font-bold text-gray-800" data-label="Amount">
                          <span className="font-bold text-gray-600 md:hidden">Amount: </span>
                          {formatINR(item.amount)}
                        </td>
                        <td className="block md:table-cell px-4 py-3 md:py-3 text-right md:text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                            aria-label="Remove item"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => setInvoiceData(prev => ({
                  ...prev,
                  items: [...prev.items, { name: '', quantity: 1, rate: 100, amount: 100 }]
                }))}
                className="mt-4 flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold hover:bg-purple-50 px-4 py-2 rounded-lg transition"
              >
                <Plus className="w-5 h-5" />
                Add New Line
              </button>
            </>
          )}
        </div>

        {/* Totals */}
        {/* RESPONSIVE: Flex container pushes content to the end on medium+. On mobile it's just a block. */}
        <div className="flex justify-center md:justify-end mb-8">
          {/* RESPONSIVE: Full width on mobile, fixed width on medium+ */}
          <div className="w-full md:w-96 space-y-4 bg-gray-50 p-4 md:p-6 rounded-lg border-2 border-gray-200">
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Subtotal:</span>
              <span className="font-semibold">{formatINR(total)}</span>
            </div>
            <div className="flex justify-between items-center border-t-2 border-gray-300 pt-4">
              <span className="font-medium text-gray-700">Received:</span>
              <div className="flex gap-2 items-center">
                <span className="text-gray-500">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={invoiceData.received === 0 ? '' : invoiceData.received}
                  onChange={(e) => setInvoiceData(prev => ({
                    ...prev,
                    received: parseFloat(e.target.value) || 0
                  }))}
                  className="w-32 border-2 border-gray-300 rounded-lg px-3 py-2 text-right focus:border-purple-500 focus:outline-none transition"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Adjustments:</span>
              <div className="flex gap-2 items-center">
                <span className="text-gray-500">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={invoiceData.adjustments === 0 ? '' : invoiceData.adjustments}
                  onChange={(e) => setInvoiceData(prev => ({
                    ...prev,
                    adjustments: parseFloat(e.target.value) || 0
                  }))}
                  className="w-32 border-2 border-gray-300 rounded-lg px-3 py-2 text-right focus:border-purple-500 focus:outline-none transition"
                />
              </div>
            </div>
            <div className="flex justify-between font-bold text-xl border-t-2 border-purple-600 pt-4 text-purple-700">
              <span>Balance Due</span>
              <span>{formatINR(balance)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {/* RESPONSIVE: Buttons stack on mobile, go in a row on medium+ */}
        <div className="flex flex-col md:flex-row justify-center gap-4">
          {invoiceData.items.length > 0 && total > 0 && (
            <PDFDownloadLink
              key={`pdf-${invoiceData.items.length}-${total}`}
              document={<InvoicePDF invoiceData={pdfData} />}
              fileName={`Invoice_${invoiceData.invoiceNo}.pdf`}
              // RESPONSIVE: Full width on mobile, auto-width on medium+
              className="w-full md:w-auto text-center bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {({ loading }) => (loading ? 'Preparing PDF...' : '📥 Download Invoice')}
            </PDFDownloadLink>
          )}

          <button
            onClick={generateNewInvoice}
            // RESPONSIVE: Full width on mobile, auto-width on medium+
            className="w-full md:w-auto bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            ➕ New Invoice
          </button>
        </div>
      </div>
    </div>
  );
}