import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'system' | 'audit' | 'legacy' | 'draft';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

const BADGE_STYLES: Record<BadgeVariant, string> = {
  success: "bg-[#dcfce7] text-[#166534]",
  warning: "bg-[#fef9c3] text-[#854d0e]",
  error: "bg-[#fee2e2] text-[#991b1b]",
  info: "bg-[#e0f2fe] text-[#0369a1]",
  system: "bg-[#f3e8ff] text-[#6b21a8]",
  audit: "bg-[#fef3c7] text-[#b45309]",
  legacy: "bg-[#f3f4f6] text-[#4b5563]",
  draft: "bg-[#e0e7ff] text-[#4338ca]"
};

function Badge({ children, variant = 'info', className = '', ...props }: BadgeProps) {
  const styleClasses = BADGE_STYLES[variant] || BADGE_STYLES.info;
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${styleClasses} ${className}`} {...props}>
      {children}
    </span>
  );
}

const _Badge = React.memo(Badge);
export { _Badge as Badge };
