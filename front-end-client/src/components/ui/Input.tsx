import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

function Input({ icon, className = '', ...props }: InputProps) {
  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-content-tertiary)] w-4 h-4 flex items-center justify-center">
          {icon}
        </div>
      )}
      <input 
        className={`w-full bg-white border border-[var(--color-border-default)] text-[var(--color-content-primary)] text-sm rounded-lg ${icon ? 'pl-9' : 'pl-4'} pr-4 h-[38px] focus:outline-none focus:border-[var(--color-brand-main)] focus:ring-0  transition-colors shadow-sm ${className}`}
        {...props}
      />
    </div>
  );
}


const _Input = React.memo(Input);
export { _Input as Input };
