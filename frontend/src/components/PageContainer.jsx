const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`max-w-7xl mx-auto px-6 lg:px-12 py-section ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
