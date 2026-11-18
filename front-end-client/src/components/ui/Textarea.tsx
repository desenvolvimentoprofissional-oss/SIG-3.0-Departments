import React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea 
      className={`w-full bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] text-[var(--color-content-primary)] text-sm rounded-lg p-3 min-h-[80px] focus:outline-none focus:border-[var(--color-brand-main)] focus:ring-0  transition-colors shadow-sm resize-y ${className}`}
      {...props}
    ></textarea>
  );
}


const _Textarea = React.memo(Textarea);
export { _Textarea as Textarea };
