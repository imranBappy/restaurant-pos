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

export const printKot = (printRef: React.RefObject<HTMLDivElement>, data: dataType) => {
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