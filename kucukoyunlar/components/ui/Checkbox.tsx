'use client';

import React, { forwardRef } from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      className = '',
      label,
      error,
      helperText,
      checked,
      disabled,
      onChange,
      ...props
    }: CheckboxProps,
    ref
  ) {
    // Hata durumu sınıfları
    const errorClass = error
      ? 'border-destructive focus:ring-destructive/50'
      : 'border-input focus:ring-primary/50';

    // Devre dışı durumu
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

    // Checkbox değişikliği
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.checked);
      }
    };

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            className={`h-4 w-4 rounded border bg-background text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errorClass} ${disabledClass} ${className}`}
            {...props}
          />
        </div>
        {label && (
          <div className="ml-3 text-sm">
            <label className={`font-medium text-foreground ${disabled ? 'opacity-50' : ''}`}>
              {label}
            </label>
            {(error || helperText) && (
              <div className="mt-1">
                {error ? (
                  <p className="text-destructive">{error}</p>
                ) : helperText ? (
                  <p className="text-muted-foreground">{helperText}</p>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox; 