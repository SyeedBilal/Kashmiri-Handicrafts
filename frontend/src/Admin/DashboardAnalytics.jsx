import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAdmin } from '../store/Slices/adminSlice';
import { DollarSign, ShoppingBag, Users, Package, Upload, Truck, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DashboardAnalytics = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const currentAdmin = useSelector(selectAdmin);

  const [products, setProducts] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats and orders
  useEffect(() => {
    if (!currentAdmin) {
      navigate('/admin/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/admin/dashboard/${currentAdmin.id}`, {
          withCredentials: true,
        });

       

        setProducts(response.data.stats || {});

        const recentOrders = response.data.stats.recentOrders || [];
        setOrders(recentOrders || []);
      
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      }
    };

    fetchDashboardData();
  }, [currentAdmin, navigate]);

  // Mark order as delivered
  const handleMarkDelivered = async (orderId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/admin/orders/deliver/${orderId}`,
        {},
        { withCredentials: true }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: 'delivered' } : order
        )
      );

      toast.success('Order marked as delivered');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
          Dashboard Overview
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Quick glance at your store's performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <StatCard icon={<DollarSign className="text-amber-900" />} label="Total Revenue" value={`₹${products.totalRevenue || 0}`} bg="bg-amber-100" />
        <StatCard icon={<ShoppingBag className="text-green-600" />} label="Total Orders" value={products.totalOrdersCount || 0} bg="bg-green-100" />
        <StatCard icon={<Users className="text-purple-600" />} label="Total Customers" value={products.totalCustomersCount || 0} bg="bg-purple-100" />
        <StatCard icon={<Package className="text-yellow-600" />} label="Total Products" value={products.totalProductsSold || 0} bg="bg-yellow-100" />
      </div>

      {/* Recent Orders */}
      <div className="mt-8 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>

        {loading ? (
          <div className="text-center py-8">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl shadow-md">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Order ID', 'Customer', 'Amount', 'Shipping Address', 'Status', 'Date', 'Actions'].map((col) => (
                      <th
                        key={col}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {order.paymentDetails?.orderId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.customerId || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        ₹{order.price || 0}
                        {order.convenienceFee && (
                          <span className="text-xs ml-1">
                            (+₹{order.convenienceFee} fee)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {order.shippingAddress
                          ? `${order.shippingAddress.address}, ${order.shippingAddress.city}`
                          : 'No address'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.orderStatus || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {order.status !== 'delivered' ? (
                          <button
                            onClick={() => handleMarkDelivered(order.orderId)}
                            className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md flex items-center text-xs cusror-pointer"
                          >
                            <Truck className="w-3 h-3 mr-1 cursor-pointer" /> Mark Delivered
                          </button>
                        ) : (
                          <span className="text-green-600 flex items-center text-xs cursor-pointer">
                            <CheckCircle className="w-3 h-3 mr-1 cursor-pointer" /> Delivered
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Navigation to Product Management */}
      <div className="mt-4">
        <button
          onClick={() => setActiveTab('products')}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
        >
          <Upload className="mr-2" size={16} />
          Go to Product Management
        </button>
      </div>
    </div>
  );
};

// 🔹 Reusable Stat Card Component
const StatCard = ({ icon, label, value, bg }) => (
  <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
    <div className={`rounded-full ${bg} p-3`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default DashboardAnalytics;
