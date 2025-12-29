import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    const titles = {
      '/admin/dashboard': 'Dashboard Overview',
      '/admin/site-content': 'Contenu du Site',
      '/admin/categories': 'Categories CRUD',
      '/admin/services': 'Services CRUD',
      '/admin/service-requests': 'Reservations',
      '/admin/partner-requests': 'Partner Requests',
      '/admin/partners': 'Gérer les Partenaires',
      '/admin/testimonials': 'Testimonials',
      '/admin/faqs': 'FAQ',
      '/admin/payments': 'Payments',
    };
    return titles[location.pathname] || 'Admin Dashboard';
  };

  // Close sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="flex h-screen bg-gray-900 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
          {/* Topbar */}
          <Topbar
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            pageTitle={getPageTitle()}
            isMenuOpen={sidebarOpen}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-12">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
