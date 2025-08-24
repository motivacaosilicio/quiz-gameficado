import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
    destructive: 'bg-red-500 hover:bg-red-700 text-white',
  };

  const sizeClasses = {
    default: 'px-4 py-2 rounded-md text-sm',
    sm: 'px-3 py-1.5 rounded-sm text-xs',
    lg: 'px-5 py-2.5 rounded-lg text-base',
  };

  const classes = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className || ''}
  `;

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
};

export default Button;
