'use client';

import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      className = '',
      options,
      label,
      error,
      helperText,
      fullWidth = false,
      disabled,
      onChange,
      ...props
    }: SelectProps,
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

    // Select değişikliği
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className={`${widthClass}`}>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`flex h-10 w-full appearance-none rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${errorClass} ${disabledClass} ${className}`}
            disabled={disabled}
            onChange={handleChange}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
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
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
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

Select.displayName = 'Select';

export default Select; 