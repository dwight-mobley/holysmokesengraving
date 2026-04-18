import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    shadow?: "none" | "sm" | "md" | "lg";
    padding?: "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({children, className, shadow = "md", padding= "md", ...props})=>{
    const baseStyles =
    "rounded-lg bg-surface-50 border border-surface-200 text-surface-900";

  const shadowStyles = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  const paddingStyles = {
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
  };

  return (
    <div
      className={clsx(baseStyles, shadowStyles[shadow], paddingStyles[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
}