import React, { useState, useMemo, useRef, useCallback } from 'react';
import { KanbanCardFields } from './KanbanTemplate';
import { useVirtualizer } from '@tanstack/react-virtual';
import { PageMapping } from '../types/index';
import { Filter, ChevronUp, ChevronDown, ListFilter } from 'lucide-react';
import { DataGridHeader, ColumnDef } from './partials/DataGridHeader';
import { DataGridRow, getNestedValue } from './partials/DataGridRow';
import { buildGridColumns, filterAndSortGridItems } from '../lib/dataGrid.util';

export interface DataGridTemplateProps {
  items: any[];
  getCardFields: (item: any) => KanbanCardFields;
  mapping?: PageMapping;
  selectedCollectionFilter?: string;
  onRowClick?: (id: string, item: any) => void;
  isLoading?: boolean;
}

export const DataGridTemplate: React.FC<DataGridTemplateProps> = ({
  items,
  getCardFields,
  mapping,
  selectedCollectionFilter,
  onRowClick,
  isLoading
}) => {
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [showFilters, setShowFilters] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const columns = useMemo(() => {
    return buildGridColumns(mapping, selectedCollectionFilter);
  }, [mapping, selectedCollectionFilter]);

  const filteredAndSortedItems = useMemo(() => {
    return filterAndSortGridItems(items, filters, sortField, sortDirection, mapping, getCardFields);
  }, [items, filters, sortField, sortDirection, mapping, getCardFields]);

  const rowVirtualizer = useVirtualizer({
    count: filteredAndSortedItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });

  const handleSort = useCallback((field: string) => {
    setSortField(prevSortField => {
      if (prevSortField === field) {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        return prevSortField;
      } else {
        setSortDirection('asc');
        return field;
      }
    });
  }, []);

  const handleFilterChange = useCallback((field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, colId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const th = (e.target as HTMLElement).closest('th') || (e.target as HTMLElement).closest('.relative');
    const startWidth = th?.getBoundingClientRect().width || 150;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(80, startWidth + (moveEvent.clientX - startX));
      setColumnWidths(prev => ({ ...prev, [colId]: newWidth }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-[var(--color-content-tertiary)]">Carregando Tabela...</div>;
  }

  return (
    <div className="bg-[var(--color-content-inverse)] rounded-xl shadow-sm border border-[var(--color-border-default)] overflow-hidden flex flex-col h-full relative">
      {}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-default)] bg-[var(--color-background-light)] rounded-t-xl">
        <span className="text-sm font-bold text-[var(--color-content-secondary)]">
          Visão de Dados
        </span>
      </div>

      {}
      <div className="flex-1 overflow-auto bg-[var(--color-content-inverse)] custom-scrollbar" ref={parentRef}>
          <div className="min-w-full inline-block align-middle">
            <div className="flex flex-col">
              {}
              <DataGridHeader 
                columns={columns}
                columnWidths={columnWidths}
                sortField={sortField}
                sortDirection={sortDirection}
                handleSort={handleSort}
                handleResizeMouseDown={handleResizeMouseDown}
              />

              {}
              <div 
                 className="relative w-full"
                 style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
              >
                {filteredAndSortedItems.length === 0 ? (
                  <div className="px-6 py-12 text-center text-[var(--color-content-tertiary)] font-medium">Nenhum registro encontrado.</div>
                ) : (
                  rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const item = filteredAndSortedItems[virtualRow.index];
                    return (
                      <DataGridRow
                        key={item._id || item.id || virtualRow.index}
                        item={item}
                        columns={columns}
                        columnWidths={columnWidths}
                        mapping={mapping}
                        getCardFields={getCardFields}
                        virtualRowSize={virtualRow.size}
                        virtualRowStart={virtualRow.start}
                        onRowClick={onRowClick}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-t border-[var(--color-border-default)] px-6 py-3 flex items-center justify-between z-10 shrink-0">
            <span className="text-xs text-[var(--color-content-tertiary)]">
              Total: <span className="font-semibold text-[var(--color-content-secondary)]">{filteredAndSortedItems.length}</span> registros
            </span>
        </div>
    </div>
  );
};
