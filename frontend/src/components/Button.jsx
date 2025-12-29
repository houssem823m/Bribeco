const variantClasses = {
  primary: 'bg-gradient-to-r from-primary via-primary-light to-secondary text-white hover:shadow-wecasa-hover hover:scale-[1.03] active:scale-[0.98] transition-all duration-300',
  secondary: 'bg-gradient-to-r from-secondary to-green-500 text-white hover:shadow-wecasa-hover hover:scale-[1.03] active:scale-[0.98] transition-all duration-300',
  danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-wecasa-hover hover:scale-[1.03] active:scale-[0.98] transition-all duration-300',
  ghost: 'bg-transparent text-primary hover:bg-primary-pastel hover:text-primary transition-all duration-300',
  'primary-pastel': 'bg-primary-pastel text-primary hover:bg-primary hover:text-white hover:shadow-wecasa transition-all duration-300',
};

const Button = ({
  children,
  variant = 'primary',
  className = '',
  isLoading = false,
  disabled,
  as: Component = 'button',
  ...props
}) => {
  return (
    <Component
      className={`inline-flex items-center justify-center px-6 py-3 rounded-pill font-semibold text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-wecasa ${variantClasses[variant]} ${className}`}
      style={variant === 'primary' ? { 
        background: 'linear-gradient(135deg, #007BFF 0%, #4DA3FF 50%, #28A745 100%)',
        color: '#FFFFFF'
      } : undefined}
      disabled={Component === 'button' ? isLoading || disabled : undefined}
      aria-disabled={Component !== 'button' && (isLoading || disabled) ? true : undefined}
      {...props}
    >
      {isLoading && (
        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2 "></span>
      )}
      {children}
    </Component>
  );
};

export default Button;
