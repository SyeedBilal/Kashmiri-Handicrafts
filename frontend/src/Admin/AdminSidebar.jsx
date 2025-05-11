import { Home, Layers, Package, DollarSign, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../store/Slices/adminSlice';
import { api } from '../services/axiosInstance';

const AdminSidebar = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    api.post('/admin/logout')
      .then((response) => {
        if (response.data.success) {
          dispatch(logoutAdmin());
          navigate('/admin/login');
        }
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  return (
    <div className={`
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      transform md:translate-x-0 transition-transform duration-300 ease-in-out
      fixed md:static left-0 top-0 z-30 w-64 min-h-screen bg-amber-900 text-amber-100 p-4
    `}>
      {/* Close button for mobile */}
      <button 
        className="md:hidden absolute right-4 top-4 text-amber-100"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <X size={24} />
      </button>

      <div className="text-2xl font-bold mb-6 flex items-center">
        <Layers className="mr-2" />
        Admin Panel
      </div>
      <nav className="space-y-2">
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`w-full text-left py-2 px-4 rounded flex items-center cursor-pointer ${activeTab === 'analytics' ? 'bg-amber-800' : 'hover:bg-amber-800'}`}
        >
          <DollarSign className="mr-2" size={18} />
          Dashboard Analytics
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`w-full text-left py-2 px-4 rounded flex items-center cursor-pointer ${activeTab === 'products' ? 'bg-amber-800' : 'hover:bg-amber-800'}`}
        >
          <Package className="mr-2" size={18} />
          Product Management
        </button>
        <button 
          onClick={handleLogout}
          className="w-full text-left py-2 px-4 rounded flex items-center hover:bg-amber-800 mt-auto cursor-pointer"
        >
          <LogOut className="mr-2" size={18} />
          Logout
        </button>
      
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`w-full text-left py-2 px-4 rounded flex items-center cursor-pointer ${activeTab === 'inventory' ? 'bg-amber-800' : 'hover:bg-amber-800'}`}>Product Inventory
       
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;