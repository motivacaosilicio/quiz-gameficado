import React from 'react';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'info';
  size?: 'default' | 'sm' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/**
 * Botão específico para o painel administrativo
 * Inclui variantes adicionais e suporte a ícones
 */
const AdminButton: React.FC<AdminButtonProps> = ({
  variant = 'primary',
  size = 'default',
  icon,
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    info: 'bg-blue-500 hover:bg-blue-600 text-white',
  };

  const sizeClasses = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1.5 text-xs',
    lg: 'px-5 py-2.5 text-base',
  };

  const baseClasses = `
    flex items-center justify-center
    font-medium rounded-md
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
  `;

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className || ''}
  `;

  return (
    <button {...props} className={classes}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default AdminButton; 