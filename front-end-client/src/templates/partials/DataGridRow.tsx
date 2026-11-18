import React from 'react';
import { ColumnDef } from './DataGridHeader';
import { ExternalLink } from 'lucide-react';

export const getNestedValue = (obj: any, path: string | undefined): any => {
  if (!obj || !path) return undefined;
  if (obj.hasOwnProperty(path)) return obj[path];
  if (!path.includes('.')) return obj[path];
  
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length; i++) {
    if (current === null || current === undefined) return undefined;
    current = current[parts[i]];
  }
  return current;
};

export const renderValue = (val: any): string => {
  if (val === null || val === undefined || val === '') return '---';
  if (typeof val === 'object') {
    if (val.seconds !== undefined) return new Date(val.seconds * 1000).toLocaleDateString('pt-BR');
    if (val instanceof Date) return val.toLocaleDateString('pt-BR');
    if (typeof val.toDate === 'function') return val.toDate().toLocaleDateString('pt-BR');
    return Array.isArray(val) ? val.join(', ') : JSON.stringify(val);
  }
  return String(val);
};

interface DataGridRowProps {
  item: any;
  columns: ColumnDef[];
  columnWidths: Record<string, number>;
  mapping?: any;
  getCardFields: (item: any) => any;
  virtualRowSize: number;
  virtualRowStart: number;
  onRowClick?: (id: string, item: any) => void;
}

export const DataGridRow = React.memo(({
  item,
  columns,
  columnWidths,
  mapping,
  getCardFields,
  virtualRowSize,
  virtualRowStart,
  onRowClick
}: DataGridRowProps) => {
  const fields = !mapping ? getCardFields(item) : null;

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onRowClick?.(item.id || item._id, item);
        }
      }}
      className="hover:bg-slate-50/80 transition-colors cursor-pointer group border-b border-[var(--color-border-default)] absolute top-0 left-0 flex w-full bg-white text-left focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[var(--color-brand-main)]/50"
      style={{
        height: `${virtualRowSize}px`,
        transform: `translateY(${virtualRowStart}px)`
      }}
      onClick={() => onRowClick?.(item.id || item._id, item)}
    >
      {columns.map(col => {
         const val = !mapping 
           ? getNestedValue(item, fields[col.id] || col.id)
           : getNestedValue(item, col.id);
           
         const width = columnWidths[col.id] ? `${columnWidths[col.id]}px` : undefined;
         return (
           <div 
             key={col.id} 
             className="px-4 py-2.5 flex items-center shrink-0 flex-1 border-r border-[var(--color-border-default)]/50 group-hover:border-[var(--color-border-default)] transition-colors"
             style={{ width, minWidth: columnWidths[col.id] ? undefined : '70px' }}
             title={String(renderValue(val))}
           >
             {col.type === 'link' && val ? (
               <a 
                 href={String(val)} 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 onClick={(e) => e.stopPropagation()}
                 className="inline-flex items-center px-2 py-1 text-[11px] font-medium rounded-md bg-[var(--color-brand-light)] text-[var(--color-brand-main)] hover:opacity-80 transition-opacity border border-[var(--color-brand-main)]/20 truncate"
               >
                 Acessar <ExternalLink size={10} className="ml-1 shrink-0" />
               </a>
             ) : (
               <span className="truncate text-[var(--color-content-secondary)] text-[12px] font-medium tracking-tight">
                 {renderValue(val)}
               </span>
             )}
           </div>
         );
      })}
    </div>
  );
});

DataGridRow.displayName = 'DataGridRow';
