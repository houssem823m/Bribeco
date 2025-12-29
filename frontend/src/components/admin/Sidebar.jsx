import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HomeIcon,
  FolderIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  UsersIcon,
  StarIcon,
  QuestionMarkCircleIcon,
  CreditCardIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import SidebarItem from './SidebarItem';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      onClose();
    }
  }, [location.pathname, onClose]);

  const menuItems = [
    { to: '/admin/dashboard', icon: HomeIcon, label: 'Dashboard Overview' },
    { to: '/admin/site-content', icon: DocumentTextIcon, label: 'Contenu du Site' },
    { to: '/admin/categories', icon: FolderIcon, label: 'Categories CRUD' },
    { to: '/admin/services', icon: WrenchScrewdriverIcon, label: 'Services CRUD' },
    { to: '/admin/service-requests', icon: ClipboardDocumentListIcon, label: 'Reservations' },
    { to: '/admin/partner-requests', icon: UserGroupIcon, label: 'Partner Requests' },
    { to: '/admin/partners', icon: UsersIcon, label: 'Gérer les Partenaires' },
    { to: '/admin/testimonials', icon: StarIcon, label: 'Testimonials' },
    { to: '/admin/faqs', icon: QuestionMarkCircleIcon, label: 'FAQ' },
    { to: '/admin/payments', icon: CreditCardIcon, label: 'Payments' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full shadow-wecasa z-50 backdrop-blur-lg
          transition-transform duration-300 ease-in-out
          w-64 min-w-[16rem]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 50%, rgba(30, 41, 59, 0.98) 100%)',
        }}
        aria-label="Admin navigation"
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="px-6 py-6 border-b border-gray-700/30">
            <h2 className="text-2xl font-bold text-white">BRIBECO Admin</h2>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4" aria-label="Admin menu">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                onClick={onClose}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
