'use client';

import React, { useEffect, useState } from 'react';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
  onClose?: (id: string) => void;
  className?: string;
}

// @ts-ignore - JSX Element tipini React.ReactElement olarak kabul etmesi için
const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = 'default',
  duration = 5000,
  onClose,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Variant sınıfları
  const variantClasses = {
    default: 'bg-background border-border',
    destructive: 'bg-destructive/10 border-destructive text-destructive',
    success: 'bg-green-100 border-green-500 text-green-800',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    info: 'bg-blue-100 border-blue-500 text-blue-800',
  }[variant];

  // İkon
  const icons = {
    default: null,
    destructive: (
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
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    success: (
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
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    warning: (
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
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    info: (
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
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  }[variant];

  // İkon renkleri
  const iconColors = {
    default: 'text-foreground',
    destructive: 'text-destructive',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  }[variant];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose(id);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`relative rounded-md border p-4 shadow-md transition-all ${variantClasses} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        {icons && <div className={`mr-3 flex-shrink-0 ${iconColors}`}>{icons}</div>}
        <div className="flex-1">
          {title && <h3 className="mb-1 font-medium">{title}</h3>}
          {description && <div className="text-sm">{description}</div>}
        </div>
        <button
          type="button"
          className="absolute top-4 right-4 inline-flex text-muted-foreground hover:text-foreground"
          onClick={() => {
            setIsVisible(false);
            if (onClose) {
              onClose(id);
            }
          }}
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
      </div>
    </div>
  );
};

export default Toast; 