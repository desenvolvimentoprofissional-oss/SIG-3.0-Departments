import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface SummaryCardMetric {
  icon: React.ElementType;
  value: string | number;
  tooltip: string;
  highlight?: 'success' | 'error' | 'default';
}

export interface SummaryCardProps {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  metrics?: SummaryCardMetric[];
  tags?: string[];
  actionLabel?: string;
  onClick?: (id: string, event: React.MouseEvent) => void;
  children?: React.ReactNode;
}

function SummaryCard({
  id,
  title,
  subtitle,
  icon: IconComponent,
  metrics = [],
  tags = [],
  actionLabel,
  onClick,
  children
}: SummaryCardProps) {
  return (
    <button 
      type="button"
      onClick={(e) => onClick && onClick(id, e)}
      className={`text-left w-full bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col group h-full duration-200 relative ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-lg bg-[var(--color-background-light)] border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-brand-main)] shrink-0">
          <div className="group-hover:scale-110 transition-transform duration-200 flex items-center justify-center">
            <IconComponent size={20} strokeWidth={1.5} />
          </div>
        </div>
      </div>
      
      <h3 className="font-bold text-[var(--color-content-primary)] mb-1 truncate" title={title}>
        {title}
      </h3>
      <p className="text-[10px] text-[var(--color-content-tertiary)] uppercase tracking-wider font-semibold mb-4 truncate">
        {subtitle}
      </p>

      {children && (
        <div className="mt-2 mb-4 flex-1">
          {children}
        </div>
      )}

      {(metrics.length > 0 || tags.length > 0 || actionLabel) && (
        <div className="mt-auto border-t border-[var(--color-border-default)] pt-4 flex items-center justify-between">
           <div className="flex items-center space-x-2 overflow-hidden mr-2">
             {metrics.map((metric, idx) => {
               const MetricIcon = metric.icon;
               let iconColor = 'text-[var(--color-content-tertiary)]';
               if (metric.highlight === 'success') iconColor = 'text-[var(--color-status-success)]';
               else if (metric.highlight === 'error') iconColor = 'text-[var(--color-status-error)]';

               return (
                 <div key={idx} className="relative group/tip flex items-center space-x-1.5 text-[var(--color-content-secondary)] shrink-0">
                     <MetricIcon size={15} strokeWidth={2} className={iconColor} />
                    <span className="font-semibold text-xs text-[var(--color-content-primary)] leading-none">
                      {metric.value}
                    </span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/tip:opacity-100 transition-opacity bg-[var(--color-content-primary)] text-[var(--color-content-inverse)] text-[10px] rounded px-2 py-1 pointer-events-none whitespace-nowrap z-50">
                      {metric.tooltip}
                    </div>
                 </div>
               );
             })}
             {tags.map((tag, idx) => (
               <div key={`tag-${idx}`} className="px-2 py-1 bg-[var(--color-background-light)] text-[var(--color-content-secondary)] border border-[var(--color-border-default)] rounded text-[10px] font-bold tracking-wider truncate shrink-0 max-w-[80px]">
                 {tag}
               </div>
             ))}
           </div>
           
           {actionLabel && (
             <span className="text-[11px] font-medium text-[var(--color-brand-main)] flex items-center shrink-0 ml-2">
               {actionLabel}
               <ChevronRight size={14} className="ml-1 transition-transform duration-300 transform group-hover:translate-x-1" />
             </span>
           )}
        </div>
      )}
    </button>
  );
}

const _SummaryCard = React.memo(SummaryCard);
export { _SummaryCard as SummaryCard };
