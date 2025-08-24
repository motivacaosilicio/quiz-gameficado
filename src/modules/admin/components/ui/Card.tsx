import React from 'react';

interface CardProps {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  children?: React.ReactNode;
}

/**
 * Componente Card para o painel administrativo
 * Utilizado para exibir estatísticas, métricas e informações resumidas
 */
const Card: React.FC<CardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
  children,
}) => {
  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${className || ''}`}>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 truncate">
              {title}
            </p>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              
              {trend && (
                <p 
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  <span className="sr-only">
                    {trend.isPositive ? 'Aumentou' : 'Diminuiu'} por
                  </span>
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </p>
              )}
            </div>
            
            {description && (
              <p className="mt-2 text-sm text-gray-500">{description}</p>
            )}
          </div>
          
          {icon && (
            <div className="p-3 bg-indigo-50 rounded-full">
              {icon}
            </div>
          )}
        </div>
      </div>
      
      {children && (
        <div className="bg-gray-50 px-5 py-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default Card; 