import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../AppContextProvider';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import config from '../../../config';

const OrderManagement = () => {
    const { allOrders,setAllOrders,filteredOrders, setFilteredOrders } = useContext(AppContext);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const {api}=config

    // useEffect(() => {
    //     setFilteredOrders(allOrders);
    // }, [allOrders]);
    const handleFilter = (criteria) => {
        const filtered = allOrders.filter(order => {
            const isStatusMatch = order.status === criteria.status || order.status.includes(criteria.status);
            const isCustomerMatch = 
            !criteria.customer || 
            (order.user && 
                `${order.user.first_name} ${order.user.last_name}`.toLowerCase().includes(criteria.customer.toLowerCase())
            );
    
            let isDateMatch = true;
            if (criteria.dateRange.start && criteria.dateRange.end) {
                const startDate = new Date(criteria.dateRange.start);
                const endDate = new Date(criteria.dateRange.end);
                const orderDate = new Date(order.date);
                isDateMatch = orderDate >= startDate && orderDate <= endDate;
            }
    
            return isStatusMatch && isCustomerMatch && isDateMatch;
        });
        setFilteredOrders(filtered);
    };
    
    const handleToggleOrder = (orderId) => {
        setSelectedOrderId(prev => (prev === orderId ? null : orderId));
    };

    const handleAction = (orderId, actionType) => {
        if(actionType==="Cancel"){
            Swal.fire({
                title: `Cancel Order?`,
                // text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Proceed',
                cancelButtonText: 'Cancel'
            })
            .then((result) => {
                if (result.isConfirmed) {
                    fetch(`${api}/order/${orderId}`,{
                        method:"PATCH",
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":`Bearer ${localStorage.getItem("access_Token")}`,
                        },
                        body:JSON.stringify({"status":"Canceled"})
                    })
                    .then(res=>{
                        if(res.ok){
                            return res.json().then(data=>{
                                let newOrders=allOrders.map((order)=>order.id===orderId?{...order,...data}:order)
                                setAllOrders(newOrders)
                                setFilteredOrders(newOrders)
                                toast.success("Order updated successfully")
                            })
                        }else{return res.json().then(data=>toast.error(data.msg))}
                    })
                }
        })
        }
        if(actionType==="Mark as Shipped"){
            Swal.fire({
                title: `Dispatch Order?`,
                // text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Proceed',
                cancelButtonText: 'Cancel'
            })
            .then((result) => {
                if (result.isConfirmed) {
                    fetch(`${api}/order/${orderId}`,{
                        method:"PATCH",
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":`Bearer ${localStorage.getItem("access_Token")}`,
                        },
                        body:JSON.stringify({"status":"Dispatched"})
                    })
                    .then(res=>{
                        if(res.ok){
                            return res.json().then(data=>{
                                let newOrders=allOrders.map((order)=>order.id===orderId?{...order,...data}:order)
                                setAllOrders(newOrders)
                                setFilteredOrders(newOrders)
                                toast.success("Order updated successfully")
                            })
                        }else{return res.json().then(data=>toast.error(data.msg))}
                    })
                }
            })
        }
        if(actionType==="Mark as Delivered"){
            Swal.fire({
                title: `Delivered Order?`,
                // text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Proceed',
                cancelButtonText: 'Cancel'
            })
            .then((result) => {
                if (result.isConfirmed) {
                    fetch(`${api}/order/${orderId}`,{
                        method:"PATCH",
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":`Bearer ${localStorage.getItem("access_Token")}`,
                        },
                        body:JSON.stringify({"status":"Delivered"})
                    })
                    .then(res=>{
                        if(res.ok){
                            return res.json().then(data=>{
                                let newOrders=allOrders.map((order)=>order.id===orderId?{...order,...data}:order)
                                setAllOrders(newOrders)
                                setFilteredOrders(newOrders)
                                toast.success("Order delivered successfully")
                            })
                        }else{return res.json().then(data=>toast.error(data.msg))}
                    })
                }
            })
        }
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Order Management</h1>
            <OrderFilters onFilter={handleFilter} />
            <OrderTable 
                orders={filteredOrders} 
                selectedOrderId={selectedOrderId} 
                onToggleOrder={handleToggleOrder} 
                onAction={handleAction}
            />
        </div>
    );
};

const OrderFilters = ({ onFilter }) => {
    const [criteria, setCriteria] = useState({ status: '', customer: '', dateRange: { start: '', end: '' } });
    const handleFilter = () => {
        const { start, end } = criteria.dateRange;
        if (start && end && new Date(start) > new Date(end)) {
            alert("Start date cannot be after end date.");
            return;
        }
        onFilter(criteria);
    };
    useEffect(()=>{handleFilter()},[criteria])
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "start" || name === "end") {
            setCriteria(prev => ({
                ...prev,
                dateRange: {
                    ...prev.dateRange,
                    [name]: value
                }
            }));
        } else {
            setCriteria((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };
    return (
        <div className="space-y-4 mb-6">
            <input
                name="customer"
                placeholder="Customer Name"
                className="px-4 py-2 border rounded-lg w-full"
                onChange={handleChange}
                value={criteria.customer}
            />
            <select
                name="status"
                className="px-4 py-2 border rounded-lg w-full"
                onChange={handleChange}
                value={criteria.status}
            >
                <option value=''>All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Canceled">Canceled</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
            </select>
            <div className="font-semibold text-lg">Filter by Date Range</div>
            <div className="flex space-x-4">
                <div>
                    <label htmlFor="start" className="block text-sm font-semibold">Start Date</label>
                    <input
                        type="date"
                        name="start"
                        className="px-4 py-2 border rounded-lg w-full"
                        onChange={handleChange}
                        value={criteria.dateRange.start}
                    />
                </div>
                <div>
                    <label htmlFor="end" className="block text-sm font-semibold">End Date</label>
                    <input
                        type="date"
                        name="end"
                        className="px-4 py-2 border rounded-lg w-full"
                        onChange={handleChange}
                        value={criteria.dateRange.end}
                    />
                </div>
            </div>
        </div>
    );
};

const OrderTable = ({ orders, selectedOrderId, onToggleOrder, onAction }) => (
    <table className="min-w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
            <tr>
                {['Order ID', 'Customer Name', 'Date', 'Status', 'Amount', 'Actions'].map(header => (
                    <th key={header} className="py-3 px-6 font-semibold text-left">{header}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {orders.map(order => (
                <React.Fragment key={order.id}>
                    <tr className={`border-b hover:bg-gray-50 ${order.status === 'Delivered' ? 'bg-green-100' : order.status === 'Pending' ? 'bg-yellow-100' :order.status==="Dispatched"?"bg-blue-100": 'bg-red-100'}`}>
                        <td className="py-3 px-6">{order.id}</td>
                        <td className="py-3 px-6">{`${order.user.first_name} ${order.user.last_name}`}</td>
                        <td className="py-3 px-6">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="py-3 px-6">{order.status}</td>
                        <td className="py-3 px-6">KSH {order.amount.toFixed(2)}</td>
                        <td className="py-3 px-6">
                            <button
                                onClick={() => onToggleOrder(order.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {selectedOrderId === order.id ? 'Hide' : 'View'}
                            </button>
                        </td>
                    </tr>
                    {selectedOrderId === order.id && (
                        <tr>
                            <td colSpan={6} className="bg-gray-50 p-6">
                                <OrderDetail order={order} onAction={onAction} />
                            </td>
                        </tr>
                    )}
                </React.Fragment>
            ))}
        </tbody>
    </table>
);

const OrderDetail = ({ order, onAction }) => (
    <div className="p-6 bg-white border rounded-lg shadow-md space-y-6">
        <h2 className="text-xl font-semibold">Order Details - {order.id}</h2>
        <p><strong>Customer:</strong> {`${order.user.first_name} ${order.user.last_name}`}</p>
        <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Amount:</strong> KSH {order.amount.toFixed(2)}</p>
        <p><strong>Products:</strong></p>
        <ul className="list-disc pl-6">
            {order.products.map(item => (
                <li key={item.product_id}>{item.product.name} - KSH {item.product.selling_price} * {item.quantity}</li>
            ))}
        </ul>
        {(order.status!=="Canceled") &&<div className="flex space-x-4 mt-4">
            {order.status === 'Pending' && (
                <button
                    onClick={() => onAction(order.id, 'Cancel')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Cancel Order
                </button>
            )}
            {order.status!=="Delivered"&&<button
                onClick={(e) => onAction(order.id, order.status==="Pending"?"Mark as Shipped":"Mark as Delivered")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
                {order.status==="Pending"?"Mark as Shipped":order.status==="Dispatched"?"Mark as Delivered":null}
            </button>}
            {order.status==="Delivered" && <button
            disabled={true}
                className="px-4 py-2 bg-green-600 text-white rounded-lg "
            >
                Delivered
            </button>}
        </div>}
    </div>
);

export default OrderManagement;
