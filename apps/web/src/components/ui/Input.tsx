import React from 'react';
import clsx from 'clsx';

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size = 'md', invalid = false, ...props }, ref) => {
    const baseStyles =
      'block w-full rounded-md bg-surface-50 border text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 transition';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    };

    const stateStyles = invalid
      ? 'border-accent-500 focus:ring-accent-500'
      : 'border-surface-300 focus:ring-brand-400 focus:border-brand-400';

    return (
      <input
        ref={ref}
        data-invalid={invalid || undefined}
        aria-invalid={invalid || undefined}
        className={clsx(baseStyles, sizeStyles[size], stateStyles, className)}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
