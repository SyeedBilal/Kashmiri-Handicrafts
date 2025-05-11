import React, { useState, useEffect } from 'react';
import {api} from "../services/axiosInstance"
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice';
import {fetchUserOrders} from '../store/Actions/orderActions';





const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const userOrders=useSelector((state)=>state.order);

const currentOrders=userOrders.orders;


  const userId=useSelector(selectCurrentUser).userId;

  const dispatch=useDispatch();


  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
await dispatch(fetchUserOrders(userId));

      
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load your orders. Please try again later.");
        setOrders([]); // Clear orders on error
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orders]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'bg-yellow-500 text-yellow-800';
      case 'shipped':
        return 'bg-blue-500 text-blue-800';
      case 'delivered':
        return 'bg-green-500 text-green-800';
      case 'cancelled':
        return 'bg-red-500 text-red-800';
      default:
        return 'bg-gray-500 text-gray-800';
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-amber-700">Loading your orders...</div>
        {/* You can add a spinner here */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-amber-800 mb-6">My Orders</h1>
        <p className="text-red-600 bg-red-100 p-4 rounded-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-8 text-center">My Orders</h1>

        {currentOrders.length === 0 ? (
          <div className="text-center py-10">
            <img src="/no-orders.svg" alt="No orders" className="mx-auto h-40 w-40 mb-4 text-gray-400" />
            <p className="text-xl text-gray-600">You haven't placed any orders yet.</p>
            <a href="/collections" className="mt-4 inline-block bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition duration-300">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {currentOrders.map((order) => (
              <div key={order._id} className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className={`px-6 py-4 bg-amber-100 border-b border-amber-200 flex flex-col sm:flex-row justify-between items-start sm:items-center`}>
                  <div>
                    <h2 className="text-lg font-semibold text-amber-800">Order ID: {order._id}</h2>
                    <p className="text-sm text-amber-700">
                      Ordered on: {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className={`mt-2 sm:mt-0 text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    Status: {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                  </span>
                </div>

                <div className="px-6 py-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-md font-semibold text-amber-800 mb-2">Shipping Address</h3>
                      <div className="text-sm text-gray-700 leading-relaxed">
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                    <div className="md:text-right">
                       <h3 className="text-md font-semibold text-amber-800 mb-2">Payment Details</h3>
                       <p className="text-sm text-gray-700">Total Amount: <span className="font-bold text-lg text-amber-900">₹{order.totalAmount.toFixed(2)}</span></p>
                       {order.convenienceFee > 0 && <p className="text-xs text-gray-500">(Includes ₹{order.convenienceFee.toFixed(2)} convenience fee)</p>}
                    
                    </div>
                  </div>
                  
                  <h3 className="text-md font-semibold text-amber-800 mb-3 pt-4 border-t border-gray-200">Items Ordered</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item._id || item.productId} className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-amber-50 rounded-lg shadow-sm">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded-md mr-0 mb-3 sm:mb-0 sm:mr-4 flex-shrink-0"
                          onError={(e) => { e.target.onerror = null; e.target.src="/placeholder-image.png"; }} // Fallback image
                        />
                        <div className="flex-grow">
                          <h4 className="text-md font-medium text-amber-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                  
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
