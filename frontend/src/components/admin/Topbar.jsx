import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bars3Icon, HomeIcon } from '@heroicons/react/24/outline';

const Topbar = ({ onMenuToggle, pageTitle, isMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="backdrop-blur-lg shadow-soft border-b border-gray-700/30 sticky top-0 z-30" style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 50%, rgba(30, 41, 59, 0.98) 100%)',
    }}>
      <div className="flex items-center justify-between px-6 py-4 lg:px-12">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-full text-gray-200 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-primary-light transition-colors"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <Bars3Icon className="w-6 h-6" aria-hidden="true" />
        </button>

        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {pageTitle || 'Admin Dashboard'}
        </h1>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-4">
          {/* Home Link */}
          <Link
            to="/"
            className="hidden md:flex items-center px-4 py-2 text-sm font-semibold text-gray-200 bg-gray-700/50 rounded-pill hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 transition-all"
            aria-label="Retour à l'accueil"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Accueil
          </Link>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-white">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="text-xs text-gray-300">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2 text-sm font-semibold text-white bg-red-500 rounded-pill hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all shadow-soft"
            aria-label="Déconnexion"
          >
            Déconnexion
          </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
