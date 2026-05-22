/**
 * Reusable Button Component - Enhanced Professional Design with Better Visibility
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  fullWidth = false,
  loading = false,
}) => {
  const baseStyles = 'font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-95 shadow-lg hover:shadow-2xl border-0';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300 active:bg-blue-800',
    secondary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-300 active:bg-purple-800',
    accent: 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-300 active:bg-orange-800',
    outline: 'border-2 border-blue-600 text-blue-700 bg-white hover:bg-blue-50 hover:border-blue-700 focus:ring-blue-200 shadow-md',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 active:bg-red-800',
    ghost: 'text-blue-700 bg-transparent hover:bg-blue-50 focus:ring-blue-200 shadow-none',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-300 active:bg-green-800',
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
