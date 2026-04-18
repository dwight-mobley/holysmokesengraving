"use client"
import React from 'react';
import clsx from 'clsx'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({children, variant = 'primary', size = 'md', className, ...props}, ref) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary:
      'bg-brand-600 text-surface-50 hover:bg-brand-700 focus:ring-brand-400',
    secondary:
      'bg-surface-800 text-brand-200 hover:bg-surface-700 focus:ring-brand-300',
    accent:
      'bg-accent-500 text-surface-50 hover:bg-accent-600 focus:ring-accent-400',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
    ref={ref}
     className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button"
