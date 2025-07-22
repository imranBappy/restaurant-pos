"use client"
import React, { useState } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

// Dummy data
const orders = [
    {
        id: "ORD-001",
        date: "2024-06-01",
        status: "Completed",
        channel: "Dine In",
        outlet: "Main Kitchen",
        amount: 120.5,
    },
    {
        id: "ORD-002",
        date: "2024-06-02",
        status: "Pending",
        channel: "Delivery",
        outlet: "Express Counter",
        amount: 80.0,
    },
    {
        id: "ORD-003",
        date: "2024-06-03",
        status: "Cancelled",
        channel: "Pickup",
        outlet: "Main Kitchen",
        amount: 0,
    },
];

const stats = {
    totalOrders: 120,
    totalRevenue: 15000,
    avgOrderValue: 125,
    completed: 100,
    pending: 15,
    cancelled: 5,
};

const orderStatusData = [
    { label: "Completed", value: stats.completed },
    { label: "Pending", value: stats.pending },
    { label: "Cancelled", value: stats.cancelled },
];

const ordersOverTime = [
    { date: "2024-06-01", value: 10 },
    { date: "2024-06-02", value: 20 },
    { date: "2024-06-03", value: 15 },
];

const columns = [
    { Header: "Order ID", accessor: "id" },
    { Header: "Date", accessor: "date" },
    { Header: "Status", accessor: "status" },
    { Header: "Channel", accessor: "channel" },
    { Header: "Outlet", accessor: "outlet" },
    { Header: "Amount", accessor: "amount" },
];

// Modern InfoCard
const InfoCard = ({ title, value, color }: { title: string; value: string; color: string }) => (
    <div className={`rounded-xl shadow-lg p-6 flex flex-col items-center bg-gradient-to-br ${color} transition-all duration-300`}>
        <div className="text-sm font-medium text-white/80 tracking-wide mb-2">{title}</div>
        <div className="text-3xl font-extrabold text-white drop-shadow-lg">{value}</div>
    </div>
);

// Modern DataTable

type OrderRow = {
    id: string;
    date: string;
    status: string;
    channel: string;
    outlet: string;
    amount: number;
};

const DataTable = ({ columns, data }: { columns: { Header: string; accessor: string }[]; data: OrderRow[] }) => (
    <div className="overflow-x-auto rounded-2xl shadow-lg bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-900 dark:to-indigo-700">
                <tr>
                    {columns.map(col => (
                        <th key={col.accessor} className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                            {col.Header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, i) => (
                    <tr
                        key={i}
                        className={
                            `transition-colors duration-200 ${i % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900"} hover:bg-blue-50 dark:hover:bg-blue-950`
                        }
                    >
                        {columns.map(col => (
                            <td key={col.accessor} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                                {row[col.accessor as keyof OrderRow] as string | number}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// Modern Bar chart using SVG
const Bar = ({ labels, data }: { labels: string[]; data: number[] }) => {
    const max = Math.max(...data, 1);
    const barColors = ["#6366f1", "#38bdf8", "#f59e42", "#10b981", "#a21caf"];
    return (
        <svg width="100%" height="120">
            {data.map((v, i) => (
                <rect
                    key={i}
                    x={i * 60 + 40}
                    y={100 - (v / max) * 80}
                    width={36}
                    height={(v / max) * 80}
                    rx={8}
                    fill={barColors[i % barColors.length]}
                    className="transition-all duration-300"
                />
            ))}
            {labels.map((label, i) => (
                <text key={i} x={i * 60 + 58} y={115} fontSize={13} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200">{label}</text>
            ))}
        </svg>
    );
};

// Modern Pie chart using SVG
const Pie = ({ data, labels }: { data: number[]; labels: string[] }) => {
    const total = data.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    const colors = ["#6366f1", "#38bdf8", "#f59e42", "#10b981", "#a21caf"];
    return (
        <svg width="120" height="120" viewBox="0 0 32 32">
            {data.map((v, i) => {
                const start = acc / total * 2 * Math.PI;
                acc += v;
                const end = acc / total * 2 * Math.PI;
                const x1 = 16 + 16 * Math.sin(start);
                const y1 = 16 - 16 * Math.cos(start);
                const x2 = 16 + 16 * Math.sin(end);
                const y2 = 16 - 16 * Math.cos(end);
                const large = end - start > Math.PI ? 1 : 0;
                return (
                    <path
                        key={i}
                        d={`M16,16 L${x1},${y1} A16,16 0 ${large} 1 ${x2},${y2} Z`}
                        fill={colors[i % colors.length]}
                        className="transition-all duration-300"
                    />
                );
            })}
            {labels.map((label, i) => (
                <text key={i} x={34} y={12 + i * 10} fontSize={5} fill="#444" className="dark:fill-gray-200">{label}</text>
            ))}
        </svg>
    );
};

// Modern Button
const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-5 py-2 rounded-xl shadow hover:from-blue-700 hover:to-indigo-600 transition font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
        {...props}
    >
        {children}
    </button>
);

const OrderReport = () => {
    const [status, setStatus] = useState<string>("All");

    // Filter logic (dummy for now)
    const filteredOrders = orders.filter(
        (order) => status === "All" || order.status === status
    );

    // Export handlers
    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Order Report", 10, 10);
        doc.save("order-report.pdf");
    };

    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredOrders);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Orders");
        XLSX.writeFile(wb, "order-report.xlsx");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-10 px-2 md:px-8">
            <div className="max-w-8xl mx-auto space-y-8">
                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-end gap-4 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow p-6 mb-2">
                    <div>
                        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Status</label>
                        <select
                            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <Button onClick={exportPDF}>Export PDF</Button>
                    <Button onClick={exportExcel}>Export Excel</Button>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <InfoCard title="Total Orders" value={stats.totalOrders.toString()} color="from-blue-500 to-indigo-500 bg-gradient-to-br" />
                    <InfoCard title="Total Revenue" value={`$${stats.totalRevenue}`} color="from-green-400 to-green-600 bg-gradient-to-br" />
                    <InfoCard title="Avg. Order Value" value={`$${stats.avgOrderValue}`} color="from-orange-400 to-pink-500 bg-gradient-to-br" />
                    <InfoCard title="Completed Orders" value={stats.completed.toString()} color="from-purple-500 to-blue-600 bg-gradient-to-br" />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-lg p-6 flex flex-col items-center">
                        <h3 className="font-semibold mb-4 text-blue-700 dark:text-blue-300 text-lg">Orders Over Time</h3>
                        <Bar
                            labels={ordersOverTime.map(o => o.date)}
                            data={ordersOverTime.map(o => o.value)}
                        />
                    </div>
                    <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-lg p-6 flex flex-col items-center">
                        <h3 className="font-semibold mb-4 text-indigo-700 dark:text-indigo-300 text-lg">Order Status Distribution</h3>
                        <Pie
                            labels={orderStatusData.map(s => s.label)}
                            data={orderStatusData.map(s => s.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-xl p-6 mt-6">
                    <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-100 text-lg">Order Details</h3>
                    <DataTable columns={columns} data={filteredOrders} />
                </div>
            </div>
        </div>
    );
};

export default OrderReport;