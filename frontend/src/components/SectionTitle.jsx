const alignClasses = {
  center: 'text-center mx-auto',
  left: 'text-left',
  right: 'text-right ml-auto',
};

const SectionTitle = ({ title, description, align = 'center', className = '' }) => {
  return (
    <div className={`mb-12 ${alignClasses[align] || 'text-center mx-auto'} ${className} animate-fade-in`}>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl leading-relaxed font-medium">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
