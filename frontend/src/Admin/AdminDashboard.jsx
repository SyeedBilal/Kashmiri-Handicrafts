import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAdminAuthenticated } from '../store/Slices/adminSlice';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import DashboardAnalytics from './DashboardAnalytics';
import ProductManagement from './ProductsManagement';
import AdminProductsList from './AdminProducts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const isAdminAuthenticated = useSelector(selectIsAdminAuthenticated);
  const [activeTab, setActiveTab] = useState('analytics');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated,[navigate]]);
 

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="flex flex-col md:flex-row">
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        
        <div className="flex-1">
          <AdminHeader 
            activeTab={activeTab}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          
          <div className="p-6">
            {activeTab === 'analytics' && (
              <DashboardAnalytics setActiveTab={setActiveTab} />
            )}

            {activeTab === 'products' && (
              <ProductManagement setActiveTab={setActiveTab} />
            )}

            {activeTab === 'inventory' && (
              <AdminProductsList setActiveTab={setActiveTab} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;