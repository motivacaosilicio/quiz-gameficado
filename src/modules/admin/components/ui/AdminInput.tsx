import React from 'react';

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

/**
 * Input específico para o painel administrativo
 * Inclui suporte a ícones, textos de ajuda e mensagens de erro
 */
const AdminInput: React.FC<AdminInputProps> = ({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  const baseInputClasses = `
    block w-full
    rounded-md border-gray-300
    shadow-sm
    focus:border-indigo-500 focus:ring-indigo-500
    sm:text-sm
  `;

  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
  
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          {...props}
          className={`
            ${baseInputClasses}
            ${errorClasses}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${className || ''}
          `}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default AdminInput; 