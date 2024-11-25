import React, { useContext, useState } from 'react';
import { AppContext } from '../../AppContextProvider';

const MyOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
    const [shipping_details,setDetails]=useState([])
  const value=useContext(AppContext)
  return (
    <div className="flex flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-6">
      
      {/* Left Side - Orders Table */}
      <div className="w-full md:w-1/2 border rounded-lg shadow-sm p-4 overflow-auto text-lg bg-white">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Orders</h2>
  <table className="w-full text-left border-collapse min-w-[300px] border border-gray-200">
    <thead className="bg-gray-100">
      <tr className={"bg-gray-100"}>
        <th className="text-gray-700 py-3 px-6 font-semibold text-left">Order ID</th>
        <th className="text-gray-700 py-3 px-6 font-semibold text-left">Date</th>
        <th className="text-gray-700 py-3 px-6 font-semibold text-left">Total</th>
        <th className="text-gray-700 py-3 px-6 font-semibold text-left">Status</th>
        <th className="text-gray-700 py-3 px-6 font-semibold text-left">Actions</th>
      </tr>
    </thead>
    {value.userData ? (
      <tbody>
        {value.userData.orders.map((order) => (
            <tr key={order.id} className={`border-b hover:bg-gray-50 ${order.status === 'Delivered' ? 'bg-green-100' : order.status === 'Pending' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
            <td className="py-3 px-6">{order.id}</td>
            <td className="py-3 px-6">{order.date}</td>
            <td className="py-3 px-6">{order.amount}</td>
            <td className="py-3 px-6">{order.status}</td>
            <td className="p-3 border-b">
              <button
                className="px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {setSelectedOrder(order);setDetails(order.shipping_address.split(", "))}}
              >
                View Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    ) : null}
  </table>
</div>



      {/* Right Side - Order Details */}
      <div className="w-full md:w-1/2 border rounded-lg shadow-sm p-4 text-lg">
        {selectedOrder ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p><strong>Date:</strong> {selectedOrder.date}</p>
            <p><strong>Total:</strong> {selectedOrder.amount}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>

            <h3 className="text-lg font-medium mt-4 mb-2">Items</h3>
            <ul className="space-y-2">
              {selectedOrder.products.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item.product.name} - {item.quantity} * {item.product.selling_price}
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">Shipping Address</h3>
            <p><strong>County:</strong> {shipping_details[0]}</p>
            <p><strong>City:</strong> {shipping_details[2]}</p>
            <p><strong>Street:</strong> {shipping_details[1]}</p>
            {/* <p><strong>Phone:</strong> {shipping_detailsphone}</p> */}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row sm:space-x-4 mt-4 space-y-2 sm:space-y-0">
              <button className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto">Reorder</button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded w-full sm:w-auto">Download Invoice</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded w-full sm:w-auto">Contact Support</button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Select an order to view details.</p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
