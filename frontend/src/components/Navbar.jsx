import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  UserIcon, 
  GiftIcon,
  Bars3Icon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import logo from '../assets/logo.svg';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="backdrop-blur-lg shadow-wecasa sticky top-0 z-50 border-b border-gray-700/30" aria-label="Navigation principale" style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 50%, rgba(30, 41, 59, 0.98) 100%)',
    }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo à gauche - Style Wecasa */}
          <Link to="/" className="flex items-center space-x-3" aria-label="Retour à l'accueil">
            <img src={logo} alt="Logo BRIBECO" className="w-10 h-10" />
            <span className="text-2xl font-bold text-white">BRIBECO</span>
          </Link>

          {/* Menu centré - Style Wecasa exact */}
          <div className="hidden lg:flex items-center space-x-10 flex-1 justify-center">
            <Link
              to="/"
              className="text-gray-200 hover:text-primary-light font-medium transition-colors text-base"
            >
              Accueil
            </Link>
            <Link
              to="/services"
              className="text-gray-200 hover:text-primary-light font-medium transition-colors text-base"
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="text-gray-200 hover:text-primary-light font-medium transition-colors text-base"
            >
              Contact
            </Link>
            {!isAuthenticated && (
              <Link
                to="/become-partner"
                className="text-gray-200 hover:text-primary-light font-medium transition-colors text-base"
              >
                Devenir partenaire
              </Link>
            )}
            {isAuthenticated && (
              <>
                {user?.role === 'client' && (
                <Link
                    to="/become-partner"
                    className="text-gray-200 hover:text-primary-light font-medium transition-colors text-base"
                >
                    Devenir partenaire
                </Link>
                )}
                {user?.role === 'partenaire' && (
                  <Link
                    to="/partner/dashboard"
                    className="text-gray-200 hover:text-primary-light font-medium transition-colors text-base"
                  >
                    Dashboard
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-200 hover:text-primary-light font-medium transition-colors text-base"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Actions à droite - Style Wecasa avec icônes */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Optional Gift Icon */}
            {!isAuthenticated && (
              <button className="text-gray-300 hover:text-primary-light transition-colors p-2">
                <GiftIcon className="w-6 h-6" />
              </button>
            )}
            
            {/* Login/User Icon */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-primary-light transition-colors p-2"
                  title="Profil"
                >
                  <UserIcon className="w-6 h-6" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-primary-light transition-colors text-sm font-medium"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-primary-light transition-colors p-2"
                  title="Connexion"
                >
                  <UserIcon className="w-6 h-6" />
                </Link>
                <Link to="/register">
                  <button 
                    className="bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:shadow-wecasa-hover hover:scale-105 transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #007BFF 0%, #28A745 100%)',
                    }}
                  >
                    Inscription
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-200 hover:bg-gray-700/50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
              ) : (
              <Bars3Icon className="h-6 w-6" />
              )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-gray-700/30 bg-gray-900/50 backdrop-blur-sm">
            <Link
              to="/"
              className="block px-4 py-2 text-gray-200 hover:bg-gray-700/50 hover:text-primary-light rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/services"
              className="block px-4 py-2 text-gray-200 hover:bg-gray-700/50 hover:text-primary-light rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-2 text-gray-200 hover:bg-gray-700/50 hover:text-primary-light rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-200 hover:bg-gray-700/50 hover:text-primary-light rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700/50 hover:text-primary-light rounded-md transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-200 hover:bg-gray-700/50 hover:text-primary-light rounded-md flex items-center space-x-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Connexion</span>
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-gray-200 hover:bg-gray-700/50 hover:text-primary-light rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
