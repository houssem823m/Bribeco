import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ to, icon: Icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        flex items-center px-6 py-4 text-sm font-semibold transition-all duration-200 rounded-wecasa mx-2 mb-1
        ${
          isActive
            ? 'bg-primary/20 text-primary-light border-l-4 border-primary-light'
            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
        }
      `}
      aria-current={isActive ? 'page' : undefined}
    >
      {Icon && <Icon className="w-5 h-5 mr-3 flex-shrink-0" aria-hidden="true" />}
      <span>{label}</span>
    </Link>
  );
};

export default SidebarItem;
