'use client';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  onClick,
  type = 'button',
  ...props
}: ButtonProps) {
  // Variant sınıfları
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
    outline: 'border border-input bg-transparent hover:bg-accent/10 hover:text-accent',
    ghost: 'bg-transparent hover:bg-primary/10 hover:text-primary',
  }[variant];

  // Size sınıfları
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }[size];

  // Full width sınıfı
  const widthClass = fullWidth ? 'w-full' : '';

  // Yükleniyor durumu
  const loadingState = isLoading ? 'opacity-70 cursor-not-allowed' : '';

  // Devre dışı durumu
  const disabledState = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${variantClasses} ${sizeClasses} ${widthClass} ${loadingState} ${disabledState} ${className}`}
      disabled={isLoading || disabled}
      onClick={onClick}
      type={type}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
      )}
      {children}
    </button>
  );
} 