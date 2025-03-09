'use client';

import React from 'react';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'accent';
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

// @ts-ignore - JSX Element tipini React.ReactElement olarak kabul etmesi için
const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'primary',
  fullScreen = false,
  text,
  className = '',
}) => {
  // Size sınıfları
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  // Variant sınıfları
  const variantClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
  }[variant];

  // Text size
  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];

  // Full screen
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-background/80 z-50'
    : 'flex items-center justify-center';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center">
        <svg
          className={`animate-spin ${sizeClasses} ${variantClasses}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {text && <p className={`mt-2 ${textSize} text-foreground`}>{text}</p>}
      </div>
    </div>
  );
};

export default Loading; 