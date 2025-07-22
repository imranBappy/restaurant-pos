"use client";
import React, { useState } from "react";
// Import your GraphQL hooks or Apollo client here
import { FaUser, FaUtensils, FaClock, FaStickyNote } from "react-icons/fa";
import { format } from "date-fns";

const KOTPage = () => {
    // State for filters
    const [kitchen, setKitchen] = useState("");
    const [orderId, setOrderId] = useState("");
    const [customer, setCustomer] = useState("");

    // Fetch KOTs using filters (replace with your actual data fetching logic)
    // const { data, loading, error } = useKitchenOrdersQuery({ variables: { kitchen, orderId, customer } });

    // Dummy data for illustration
    const kotList = [
        {
            id: "1",
            status: "PENDING",
            notes: "No onions",
            completionTime: "2024-07-16T16:00:00Z",
            kitchen: { id: "1", name: "Main Kitchen" },
            order: {
                id: "101",
                customer: { id: "c1", name: "John Doe", phone: "1234567890" },
                orderProducts: [
                    { id: "op1", product: { id: "p1", name: "Pizza" }, quantity: 2 },
                    { id: "op2", product: { id: "p2", name: "Pasta" }, quantity: 1 },
                ],
            },
        },
        {
            id: "2",
            status: "READY",
            notes: "Extra sauce",
            completionTime: "2024-07-16T17:30:00Z",
            kitchen: { id: "2", name: "Dessert Kitchen" },
            order: {
                id: "102",
                customer: { id: "c2", name: "Jane Smith", phone: "9876543210" },
                orderProducts: [
                    { id: "op3", product: { id: "p3", name: "Ice Cream" }, quantity: 1 },
                    { id: "op4", product: { id: "p4", name: "Cake" }, quantity: 1 },
                ],
            },
        },
        {
            id: "3",
            status: "COMPLETED",
            notes: "No changes",
            completionTime: "2024-07-16T18:00:00Z",
            kitchen: { id: "1", name: "Main Kitchen" },
            order: {
                id: "103",
                customer: { id: "c3", name: "Peter Jones", phone: "1122334455" },
                orderProducts: [
                    { id: "op5", product: { id: "p5", name: "Burger" }, quantity: 1 },
                    { id: "op6", product: { id: "p6", name: "Fries" }, quantity: 1 },
                ],
            },
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Kitchen Order Tickets (KOT)</h1>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <select
                    className="border rounded px-3 py-2"
                    value={kitchen}
                    onChange={e => setKitchen(e.target.value)}
                >
                    <option value="">All Kitchens</option>
                    <option value="1">Main Kitchen</option>
                    {/* Map your kitchens here */}
                </select>
                <input
                    className="border rounded px-3 py-2"
                    placeholder="Order ID"
                    value={orderId}
                    onChange={e => setOrderId(e.target.value)}
                />
                <input
                    className="border rounded px-3 py-2"
                    placeholder="Customer"
                    value={customer}
                    onChange={e => setCustomer(e.target.value)}
                />
                {/* Add more filters as needed */}
            </div>

            {/* KOT Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kotList.map(kot => (
                    <div
                        key={kot.id}
                        className={`
                            relative rounded-xl shadow-md border-l-4 p-5 mb-4
                            transition-all duration-200
                            hover:shadow-xl hover:border-opacity-80 hover:bg-opacity-90
                            ${kot.status === "PENDING"
                                ? "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-800/40"
                                : kot.status === "READY"
                                    ? "bg-green-50 dark:bg-green-900/30 border-green-500 hover:bg-green-100 dark:hover:bg-green-800/40"
                                    : kot.status === "COMPLETED"
                                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/40"
                                        : "bg-gray-50 dark:bg-gray-800 border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60"
                            }
                        `}
                    >
                        {/* Status badge and time */}
                        <div className="flex justify-between items-center mb-2">
                            <span className={`
                                px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                ${kot.status === "PENDING"
                                    ? "bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100"
                                    : kot.status === "READY"
                                        ? "bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100"
                                        : kot.status === "COMPLETED"
                                            ? "bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100"
                                            : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"}
                            `}>
                                {kot.status}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-200">
                                <FaClock className="inline-block" />
                                {format(new Date(kot.completionTime), "HH:mm, dd MMM yyyy")}
                            </span>
                        </div>
                        {/* Order/Kitchen/Customer */}
                        <div className="mb-2 flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                                <FaUtensils className="text-blue-500" />
                                {kot.kitchen.name}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                                <FaUser className="text-green-500" />
                                {kot.order.customer.name} <span className="text-gray-400">({kot.order.customer.phone})</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium text-indigo-700 dark:text-indigo-300">Order #</span>
                                <span className="font-bold text-indigo-900 dark:text-indigo-100">{kot.order.id}</span>
                            </div>
                            {kot.notes && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <FaStickyNote className="text-yellow-500" />
                                    {kot.notes}
                                </div>
                            )}
                        </div>
                        {/* Order Items */}
                        <div className="mt-3">
                            <div className="font-semibold mb-1 text-sm text-gray-700 dark:text-gray-200">Order Items:</div>
                            <div className="flex flex-wrap gap-2">
                                {kot.order.orderProducts.map(item => (
                                    <span
                                        key={item.id}
                                        className="bg-white/80 dark:bg-gray-700/80 rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1 border border-gray-200 dark:border-gray-600"
                                    >
                                        <span className="text-gray-800 dark:text-gray-100">{item.product.name}</span>
                                        <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full px-2 ml-2 font-bold">
                                            x{item.quantity}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KOTPage;

