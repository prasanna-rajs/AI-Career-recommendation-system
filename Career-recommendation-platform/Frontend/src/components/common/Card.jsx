/**
 * Reusable Card Component - Enhanced Professional Design
 */
const Card = ({
  children,
  title,
  subtitle,
  icon,
  className = '',
  hoverable = false,
  onClick,
  gradient = false,
}) => {
  const baseStyles = 'bg-white rounded-2xl shadow-xl p-6 border border-gray-100';
  const hoverStyles = hoverable
    ? 'hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer hover:border-primary-200'
    : '';
  const gradientStyles = gradient
    ? 'bg-gradient-to-br from-primary-50 via-white to-secondary-50'
    : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${gradientStyles} ${className}`}
      onClick={onClick}
    >
      {icon && (
        <div className="text-5xl mb-4 animate-float">{icon}</div>
      )}
      {title && (
        <h3 className="text-xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-gray-700 mb-4">{subtitle}</p>
      )}
      {children}
    </div>
  );
};

export default Card;
