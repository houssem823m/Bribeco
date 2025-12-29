import { Link } from 'react-router-dom';
import Button from './Button';

const ErrorBlock = ({ message = 'Une erreur est survenue', onRetry, showHomeButton = true }) => {
  const isAdminContext = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  return (
    <div className={`${isAdminContext ? 'bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-700' : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'} border-2 rounded-wecasa-lg p-10 text-center shadow-soft animate-scale-in`}>
      <div className="mb-6">
        <p className={`${isAdminContext ? 'text-red-300' : 'text-red-800'} font-bold text-lg mb-2`}>{message}</p>
        <p className={`${isAdminContext ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Merci de réessayer ou de revenir à l'accueil.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="danger"
            className="px-6 py-3"
          >
            Réessayer
          </Button>
        )}
        {showHomeButton && (
          <Button
            as={Link}
            to="/"
            variant="ghost"
            className="px-6 py-3"
          >
            Retour à l'accueil
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorBlock;
