import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'disabled';
  icon?: React.ReactNode;
};

function Button({ variant = 'primary', icon, children, className = '', disabled, ...props }: ButtonProps) {
  
  const baseClasses = "flex items-center justify-center px-1 sm:px-4 py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all focus:outline-none gap-1.5";
  
  let variantClasses = "";
  if (disabled || variant === 'disabled') {
    variantClasses = "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed";
  } else {
    switch (variant) {
      case 'primary':
        variantClasses = "bg-[var(--color-brand-main)] hover:bg-[var(--color-brand-dark)] text-white shadow-sm focus:ring-2 focus:ring-[var(--color-brand-main)] focus:ring-offset-2";
        break;
      case 'secondary':
        variantClasses = "bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] hover:border-[var(--color-brand-main)] hover:text-[var(--color-brand-main)] text-[var(--color-content-secondary)] shadow-sm";
        break;
      case 'danger':
        variantClasses = "border border-transparent bg-[var(--color-status-error)] text-white hover:opacity-90";
        break;
    }
  }

  return (
    <button 
      disabled={disabled || variant === 'disabled'}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}


const _Button = React.memo(Button);
export { _Button as Button };
