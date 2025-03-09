'use client';

import React, { forwardRef } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'capture'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  capture?: boolean | 'user' | 'environment';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      className = '',
      label,
      error,
      helperText,
      fullWidth = false,
      startIcon,
      endIcon,
      disabled,
      ...props
    }: InputProps,
    ref
  ) {
    // Tam genişlik sınıfı
    const widthClass = fullWidth ? 'w-full' : '';

    // Hata durumu sınıfları
    const errorClass = error
      ? 'border-destructive focus:ring-destructive/50'
      : 'border-input focus:ring-primary/50';

    // Devre dışı durumu
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed bg-muted' : '';

    // İkon durumu
    const hasStartIcon = startIcon ? 'pl-10' : '';
    const hasEndIcon = endIcon ? 'pr-10' : '';

    return (
      <div className={`${widthClass}`}>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${errorClass} ${disabledClass} ${hasStartIcon} ${hasEndIcon} ${className}`}
            disabled={disabled}
            {...props}
          />
          {endIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
              {endIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <div className="mt-1.5 text-sm">
            {error ? (
              <p className="text-destructive">{error}</p>
            ) : helperText ? (
              <p className="text-muted-foreground">{helperText}</p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 