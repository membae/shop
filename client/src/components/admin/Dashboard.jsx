
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-200 text-gray-800">
            <Header />
            <main className="p-6 space-y-6">
                <MetricsGrid />
                <SalesChart />
            </main>
        </div>
    );
};

const Header = () => (
    <header className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="flex space-x-4">
            {/* <Button color="bg-blue-600" label="Filter by Date" />
            <Button color="bg-green-600" label="POS" />
            <Button color="bg-indigo-600" label="Add Product" /> */}
        </div>
    </header>
);

const Button = ({ color, label }) => (
    <button className={`${color} px-4 py-2 rounded`}>{label}</button>
);

const MetricsGrid = () => {
    const dummyMetricsData = [
        { label: "Total Sales", value: "KSh 200", bgColor: "bg-blue-500" },
        { label: "Net Profit", value: "KSh 20", bgColor: "bg-green-500" },
        // { label: "Invoice Due", value: "KSh 50,000", bgColor: "bg-yellow-500" },
        // { label: "Total Sell Return", value: "KSh 20,000", bgColor: "bg-red-500" },
        // { label: "Total Purchase", value: "KSh 500,000", bgColor: "bg-teal-500" },
        // { label: "Purchase Due", value: "KSh 100,000", bgColor: "bg-orange-500" },
        // { label: "Total Purchase Return", value: "KSh 15,000", bgColor: "bg-pink-500" },
        // { label: "Expense", value: "KSh 70,000", bgColor: "bg-purple-500" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dummyMetricsData.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
            ))}
        </div>
    );
};

const MetricCard = ({ label, value, bgColor }) => (
    <div className={`p-4 rounded-lg shadow-md text-white ${bgColor}`}>
        <p className="text-sm font-medium opacity-80">{label}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
    </div>
);

const SalesChart = () => {
    const [timeRange, setTimeRange] = useState('30'); // Default to last 30 days

    const getDummyData = () => {
        const labels = Array.from({ length: timeRange }, (_, i) => `${i + 1} Oct`);
        const sales = Array.from({ length: timeRange }, () => Math.floor(Math.random() * 40000) + 10000);

        return {
            labels,
            datasets: [
                {
                    label: 'Total Sales (KSh)',
                    data: sales,
                    borderColor: '#4F46E5',
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    fill: true,
                    tension: 0.3,
                },
            ],
        };
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: '#4A5568' },
                grid: { color: '#E2E8F0' },
            },
            x: {
                ticks: { color: '#4A5568' },
                grid: { display: false },
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Sales Last {timeRange} Days</h3>
                <select
                    className="p-2 border rounded"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                >
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                </select>
            </div>
            <Line data={getDummyData()} options={options} />
        </div>
    );
};

export default Dashboard;