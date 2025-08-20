// app/components/CustomerInvoice.tsx

import React, { useRef } from "react";
import { format } from "date-fns";

const demoInvoice = {
    invoiceNo: "INV-2025-001",
    date: new Date(),
    customerName: "Mr. Imran",
    items: [
        { name: "Chicken Burger", qty: 2, price: 250 },
        { name: "French Fries", qty: 1, price: 120 },
        { name: "Coke (Can)", qty: 2, price: 60 },
    ],
    discount: 50,
    taxPercent: 5,
};

const CustomerInvoice = () => {
    const printRef = useRef<HTMLDivElement>(null);

    const subtotal = demoInvoice.items.reduce(
        (sum, item) => sum + item.qty * item.price,
        0
    );
    const tax = (subtotal * demoInvoice.taxPercent) / 100;
    const total = subtotal + tax - demoInvoice.discount;

    const handlePrint = () => {
        const printContents = printRef.current?.innerHTML;
        const win = window.open("", "PRINT", "height=600,width=400");
        if (win && printContents) {
            win.document.write(`
        <html>
          <head>
            <title>${demoInvoice.invoiceNo}</title>
            <style>
              body {
                font-family: monospace;
                font-size: 14px;
                padding: 20px;
              }
              .header {
                text-align: center;
                border-bottom: 1px dashed #000;
                margin-bottom: 10px;
              }
              .table, .footer {
                width: 100%;
              }
              .row {
                display: flex;
                justify-content: space-between;
                margin: 4px 0;
              }
              .footer {
                border-top: 1px dashed #000;
                margin-top: 10px;
                padding-top: 10px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `);
            win.document.close();
            win.focus();
            win.print();
            win.close();
        }
    };

    return (
        <div className="p-4">
            <button
                onClick={handlePrint}
                className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                Print Invoice
            </button>

            <div ref={printRef}>
                <div className="header">
                    <h2>Awesome Restaurant</h2>
                    <p>123 Foodie St, Dhaka</p>
                </div>

                <div className="mb-2">
                    <p><strong>Invoice No:</strong> {demoInvoice.invoiceNo}</p>
                    <p><strong>Date:</strong> {format(demoInvoice.date, "dd/MM/yyyy hh:mm a")}</p>
                    <p><strong>Customer:</strong> {demoInvoice.customerName}</p>
                </div>

                <div className="table border-t border-b border-gray-300 py-2">
                    {demoInvoice.items.map((item, idx) => (
                        <div className="row" key={idx}>
                            <span>{item.qty} x {item.name}</span>
                            <span>{item.qty * item.price}৳</span>
                        </div>
                    ))}
                </div>

                <div className="mt-2">
                    <div className="row">
                        <span>Subtotal</span>
                        <span>{subtotal.toFixed(2)}৳</span>
                    </div>
                    <div className="row">
                        <span>Tax ({demoInvoice.taxPercent}%)</span>
                        <span>{tax.toFixed(2)}৳</span>
                    </div>
                    <div className="row">
                        <span>Discount</span>
                        <span>-{demoInvoice.discount.toFixed(2)}৳</span>
                    </div>
                    <div className="row font-bold border-t border-gray-400 pt-1">
                        <span>Total</span>
                        <span>{total.toFixed(2)}৳</span>
                    </div>
                </div>

                <div className="footer mt-4">
                    <p>Thank you for dining with us!</p>
                    <p>Visit Again 🙏</p>
                </div>
            </div>
        </div>
    );
};

export default CustomerInvoice;
