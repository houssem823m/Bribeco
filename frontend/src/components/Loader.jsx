const Loader = ({ message = 'Chargement en cours...' }) => {
  const isAdminContext = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="relative">
        <div className={`animate-spin rounded-full h-16 w-16 border-4 ${isAdminContext ? 'border-gray-700 border-t-primary-light' : 'border-primary-pastel border-t-primary'} mb-6`}></div>
        <div className={`absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent ${isAdminContext ? 'border-r-primary-light' : 'border-r-primary-light'} opacity-50`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className={`text-base font-semibold ${isAdminContext ? 'text-gray-200' : 'text-gray-700'}`}>{message}</p>
    </div>
  );
};

export default Loader;
