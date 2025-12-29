const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-wecasa-lg p-12 text-center shadow-soft animate-scale-in">
      {icon && (
        <div className="text-7xl mb-6 transform hover:scale-110 transition-transform duration-300 inline-block">{icon}</div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      {description && <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
