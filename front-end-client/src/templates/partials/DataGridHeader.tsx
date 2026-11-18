import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface ColumnDef {
  id: string;
  label: string;
  type: string;
}

interface DataGridHeaderProps {
  columns: ColumnDef[];
  columnWidths: Record<string, number>;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: string) => void;
  handleResizeMouseDown: (e: React.MouseEvent, colId: string) => void;
}

export const DataGridHeader = React.memo(({
  columns,
  columnWidths,
  sortField,
  sortDirection,
  handleSort,
  handleResizeMouseDown
}: DataGridHeaderProps) => {
  return (
    <div className="flex sticky top-0 z-20 bg-[var(--color-background-light)] border-b border-[var(--color-border-default)] shadow-sm text-[11px] uppercase font-bold tracking-wider text-[var(--color-content-tertiary)]">
      {columns.map(col => {
        const width = columnWidths[col.id] ? `${columnWidths[col.id]}px` : undefined;
        
        return (
          <div 
            key={col.id} 
            className="border-r border-[var(--color-border-default)] relative transition-colors flex flex-1 shrink-0 bg-[var(--color-background-main)] hover:bg-[var(--color-background-light)]" 
            style={{ width, minWidth: columnWidths[col.id] ? undefined : '70px' }}
          >
            <div className="flex flex-col w-full">
              <button 
                className="px-4 py-3 cursor-pointer flex items-center group flex-1 w-full text-left" 
                onClick={() => handleSort(col.id)} 
                type="button">
                 <span className="truncate flex-1" title={col.label}>{col.label}</span>
                 <div className="flex flex-col ml-1 opacity-40 group-hover:opacity-100 shrink-0">
                    <ChevronUp className={`w-3 h-3 -mb-1 ${sortField === col.id && sortDirection === 'asc' ? 'text-[var(--color-brand-main)] opacity-100' : ''}`} />
                    <ChevronDown className={`w-3 h-3 ${sortField === col.id && sortDirection === 'desc' ? 'text-[var(--color-brand-main)] opacity-100' : ''}`} />
                 </div>
              </button>
            </div>
            
            <div 
              onMouseDown={(e) => handleResizeMouseDown(e, col.id)}
              className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[var(--color-brand-main)]/50 group-hover:bg-[var(--color-brand-main)]/20 transition-colors z-20 hidden md:block"
            />
          </div>
        );
      })}
    </div>
  );
});

DataGridHeader.displayName = 'DataGridHeader';
