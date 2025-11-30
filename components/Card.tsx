import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, icon }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${className}`}>
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
          {icon && <span className="text-vietin">{icon}</span>}
          {title && <h3 className="font-semibold text-lg text-gray-800">{title}</h3>}
        </div>
      )}
      {children}
    </div>
  );
};