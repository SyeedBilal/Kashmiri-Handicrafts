import { Home, ChevronRight, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../store/Slices/adminSlice';
import { api } from '../services/axiosInstance';

const AdminHeader = ({ activeTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

const handleLogout = () => {
  api.post('http://localhost:3000/api/admin/logout')
  .then((response) => {
    if (response.data.success) {
      dispatch(logoutAdmin());
      navigate('/admin/login');
    }
  })
  .catch((error) => {
    console.error("Error during logout:", error);
  });
}

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        {/* Mobile menu button */}
        <button
          className="md:hidden text-amber-900 hover:text-amber-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center">
          <Home size={20} className="text-amber-900" />
          <ChevronRight size={16} className="mx-1 text-amber-400" />
          <span className="text-amber-900">
            {activeTab === 'analytics' ? 'Dashboard Analytics' : 'Product Management'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-amber-900">Welcome, Admin</p>
            <p className="text-xs text-amber-600 hidden sm:block">Last login: Today at 09:30 AM</p>
          </div>
          <button 
            onClick={handleLogout}
            className="md:hidden flex items-center py-2 px-4 rounded bg-amber-900 text-amber-50 hover:bg-amber-800 cursor-pointer"
          >
            <LogOut className="w-4 h-4 cursor-pointer" onClick={handleLogout}/>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;