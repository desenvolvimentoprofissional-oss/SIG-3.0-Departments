import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div 
      className={`p-5 bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-xl shadow-sm hover:shadow-md transition-shadow ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}


const _Card = React.memo(Card);
export { _Card as Card };
