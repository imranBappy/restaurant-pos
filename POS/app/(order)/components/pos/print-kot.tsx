// app/components/KOTTicket.tsx

import React, { useRef } from "react";
import { format } from "date-fns";

const data = {
  kotNumber: "KOT-00123",
  table: "Table 5",
  waiter: "John",
  time: new Date(),
  items: [
    { name: "Chicken Biryani", qty: 2, note: "Less spicy" },
    { name: "Paneer Butter Masala", qty: 1, note: "" },
    { name: "Garlic Naan", qty: 3, note: "Extra garlic" },
  ],
};

interface dataType {
  kotNumber: string;
  table: string;
  waiter: string;
  time: Date;
  items: {
    name: string;
    qty: number;
    note: string;
  }[];
}

const KOTTicket = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = (printRef: React.RefObject<HTMLDivElement>, data: dataType) => {
    const printContents = printRef.current?.innerHTML;
    const win = window.open("", "PRINT", "height=600,width=400");
    if (win && printContents) {
      win.document.write(`
        <html>
          <head>
            <title>${data.kotNumber}</title>
            <style>
              body {
                font-family: monospace;
                font-size: 14px;
                padding: 20px;
              }
              .kot-header {
                text-align: center;
                border-bottom: 1px dashed #000;
                margin-bottom: 10px;
              }
              .kot-table {
                width: 100%;
                margin-bottom: 10px;
              }
              .kot-item {
                border-bottom: 1px dashed #ccc;
                padding: 5px 0;
              }
              .note {
                font-size: 12px;
                color: gray;
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
        className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Print KOT
      </button>

      <div ref={printRef}>
        <div className="kot-header">
          <h2>KITCHEN ORDER TICKET</h2>
        </div>

        <div className="kot-table">
          <p><strong>KOT No:</strong> {data.kotNumber}</p>
          <p><strong>Table:</strong> {data.table}</p>
          <p><strong>Waiter:</strong> {data.waiter}</p>
          <p><strong>Time:</strong> {format(data.time, "hh:mm a dd/MM/yyyy")}</p>
        </div>

        <div>
          {data.items.map((item, index) => (
            <div className="kot-item" key={index}>
              <p>
                {item.qty}x <strong>{item.name}</strong>
              </p>
              {item.note && <p className="note">Note: {item.note}</p>}
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <p>--- End of Ticket ---</p>
        </div>
      </div>
    </div>
  );
};

export default KOTTicket;
