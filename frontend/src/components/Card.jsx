const Card = ({ children, className = '', variant = 'default' }) => {
  const variantClasses = {
    default: 'shadow-wecasa border-2 border-transparent hover:border-primary/10',
    soft: 'bg-neutral-soft shadow-soft border-2 border-gray-100',
    beige: 'bg-beige-light shadow-soft border-2 border-beige-soft',
  };

  // Si className contient déjà un bg-*, on ne veut pas que variantClasses écrase
  const hasCustomBg = className.includes('bg-');
  // Vérifier si on est dans un contexte admin (fond sombre)
  const isAdminContext = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const baseClasses = hasCustomBg 
    ? 'shadow-wecasa border-2 border-transparent hover:border-primary/10'
    : isAdminContext && !hasCustomBg
    ? `${variantClasses[variant]} bg-gray-800 border-gray-700`
    : `${variantClasses[variant]} bg-white`;

  return (
    <div className={`rounded-wecasa-lg p-8 ${baseClasses} transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
