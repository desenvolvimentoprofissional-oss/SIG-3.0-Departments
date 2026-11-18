import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface CollapsibleCardProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerAction?: React.ReactNode;
  compact?: boolean;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  title,
  subtitle,
  children,
  defaultOpen = false,
  className = '',
  headerAction,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = React.useId();

  return (
    <div className={`rounded-xl border border-[var(--color-border-default)] shadow-sm ${className.includes("bg-") ? "" : "bg-white"} ${className}`}>
      <div className={`w-full flex items-center justify-between gap-3 ${compact ? 'py-3 px-4 md:py-3.5 md:px-5' : 'p-4 md:p-6'} rounded-t-xl ${!isOpen ? 'rounded-b-xl' : ''} hover:bg-[var(--color-background-soft)] transition-colors select-none`}>
        <div className="flex-1 flex items-center gap-2 flex-wrap sm:flex-nowrap min-w-0">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="false"
            aria-controls={contentId}
            className="text-left bg-transparent border-0 p-0 m-0 cursor-pointer flex items-center gap-2 font-bold text-sm text-[var(--color-content-primary)] hover:text-[var(--color-brand-main)] transition-colors min-w-0"
          >
            <span className="block">{title}</span>
          </button>
          {subtitle && (
            <div className="relative group/info inline-flex items-center shrink-0">
              <Info size={14} className="text-[var(--color-content-tertiary)] hover:text-[var(--color-brand-main)] cursor-help transition-colors" aria-label="Informação adicional" />
              <div role="tooltip" className="absolute left-0 sm:left-full sm:ml-2.5 top-full sm:top-1/2 mt-1.5 sm:mt-0 sm:-translate-y-1/2 z-[999] bg-[var(--color-background-dark)] text-[var(--color-content-inverse)] text-[12px] font-normal px-3.5 py-2 rounded-xl shadow-xl pointer-events-none opacity-0 group-hover/info:opacity-100 transition-all duration-200 w-max max-w-[240px] sm:max-w-md leading-relaxed block">
                {subtitle}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {headerAction && <div className="flex items-center gap-2">{headerAction}</div>}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls={contentId}
            aria-label={isOpen ? "Collapse card" : "Expand card"}
            title={isOpen ? "Collapse card" : "Expand card"}
            className="text-[var(--color-content-tertiary)] p-1 hover:bg-slate-200/50 rounded-lg transition-colors flex items-center justify-center bg-transparent border-0 cursor-pointer"
          >
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div id={contentId} className={`${compact ? 'p-4 md:p-5 pt-2 md:pt-2' : 'p-4 md:p-6 pt-2'} rounded-b-xl`}>
          {children}
        </div>
      )}
    </div>
  );
};

const _CollapsibleCard = React.memo(CollapsibleCard);
export { _CollapsibleCard as CollapsibleCard };
