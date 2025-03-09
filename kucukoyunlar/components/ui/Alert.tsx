'use client';

import React from 'react';

export interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

// @ts-ignore - JSX Element tipini React.ReactElement olarak kabul etmesi için
const Alert: React.FC<AlertProps> = ({
  title,
  children,
  variant = 'default',
  icon,
  onClose,
  className = '',
}) => {
  // Variant sınıfları
  const variantClasses = {
    default: 'bg-background border-border',
    destructive: 'bg-destructive/10 border-destructive text-destructive',
    success: 'bg-green-100 border-green-500 text-green-800',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    info: 'bg-blue-100 border-blue-500 text-blue-800',
  }[variant];

  // İkon renkleri
  const iconColors = {
    default: 'text-foreground',
    destructive: 'text-destructive',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  }[variant];

  return (
    <div
      className={`relative rounded-md border p-4 ${variantClasses} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        {icon && <div className={`mr-3 flex-shrink-0 ${iconColors}`}>{icon}</div>}
        <div className="flex-1">
          {title && <h3 className="mb-1 font-medium">{title}</h3>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            type="button"
            className="absolute top-4 right-4 inline-flex text-muted-foreground hover:text-foreground"
            onClick={onClose}
            aria-label="Kapat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert; 