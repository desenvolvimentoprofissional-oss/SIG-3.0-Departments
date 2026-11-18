import React, { useMemo, useState, useRef, useCallback } from 'react';
import { PageMapping } from '../types';
import { Card } from '../components/ui/Card';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { DataGridHeader, ColumnDef } from './partials/DataGridHeader';
import { DataGridRow } from './partials/DataGridRow';
import { buildGridColumns, filterAndSortGridItems } from '../lib/dataGrid.util';

interface AuditoriaTemplateProps {
  items: any[];
  mapping: PageMapping;
  getCardFields: (item: any) => any;
  onCardClick: (id: string, item: any) => void;
  selectedCollectionFilter?: string;
}

export const AuditoriaTemplate: React.FC<AuditoriaTemplateProps> = ({ items, mapping, getCardFields, onCardClick, selectedCollectionFilter }) => {
  const auditConfig = useMemo(() => {
    if (selectedCollectionFilter && selectedCollectionFilter !== 'ALL' && mapping.dataSources && mapping.dataSources.length > 0) {
      const selectedDs = mapping.dataSources.find((ds: any) => {
        const dsId = ds.id || ds.mainCollection?.id || ds.mainCollection?.collectionName || ds.collectionName;
        return dsId === selectedCollectionFilter;
      });
      if (selectedDs && selectedDs.viewConfig?.components?.auditConfig) {
        return selectedDs.viewConfig.components.auditConfig;
      }
    }
    if (mapping.viewConfig?.components?.auditConfig) return mapping.viewConfig.components.auditConfig;
    if (mapping.dataSources && mapping.dataSources.length > 0) {
      for (const ds of mapping.dataSources) {
        if (ds.viewConfig?.components?.auditConfig) return ds.viewConfig.components.auditConfig;
      }
    }
    return null;
  }, [mapping, selectedCollectionFilter]);
  
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  const auditCols = auditConfig?.columns || [];

  const auditRules = useMemo(() => {
    return auditCols.map((col: any) => ({
      ...col,
      ncvSet: new Set(col.nonCompliantValues.map((v: string) => v.trim().toLowerCase()))
    }));
  }, [auditCols]);

  const { analysis, itemsWithAuditResults, totalNonCompliantCount } = useMemo(() => {
    const analysisMap = new Map<string, { col: any, items: any[] }>();
    auditRules.forEach(rule => {
      analysisMap.set(rule.id, { col: rule, items: [] });
    });

    let totalNC = 0;

    const enrichedItems = items.map(item => {
      const ncs: string[] = [];
      
      auditRules.forEach(rule => {
        const val = item[rule.field];
        if (val) {
          const strVal = String(val).trim().toLowerCase();
          if (rule.ncvSet.has(strVal)) {
            ncs.push(rule.label);
            analysisMap.get(rule.id)!.items.push(item);
          }
        }
      });

      if (ncs.length > 0) totalNC++;

      return {
        ...item,
        _auditResult: ncs.length > 0 ? ncs.join(', ') : 'Conforme'
      };
    });

    const colStats = Array.from(analysisMap.values()).map(({ col, items }) => ({
      ...col,
      nonCompliantItems: items,
      count: items.length
    }));

    return { analysis: colStats, itemsWithAuditResults: enrichedItems, totalNonCompliantCount: totalNC };
  }, [items, auditRules]);

  const displayItems = useMemo(() => {
    if (selectedColumnId) {
       const col = analysis.find((c: any) => c.id === selectedColumnId);
       const itemsForCol = col ? col.nonCompliantItems : [];
       const idsForCol = new Set(itemsForCol.map((i: any) => i._id || i.id));
       return itemsWithAuditResults.filter(i => idsForCol.has(i._id || i.id));
    }
    return itemsWithAuditResults.filter(item => item._auditResult !== 'Conforme');
  }, [itemsWithAuditResults, analysis, selectedColumnId]);

  const columns = useMemo(() => {
    const baseCols = buildGridColumns(mapping, selectedCollectionFilter);
    return [
      ...baseCols,
      { id: '_auditResult', label: 'Não Conformidades', type: 'string' }
    ] as ColumnDef[];
  }, [mapping, selectedCollectionFilter]);

  const filteredAndSortedItems = useMemo(() => {
    return filterAndSortGridItems(displayItems, {}, sortField, sortDirection, mapping, getCardFields);
  }, [displayItems, sortField, sortDirection, mapping, getCardFields]);

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

  if (!auditCols.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[var(--color-content-secondary)]">
        <AlertTriangle size={48} className="mb-4 text-[var(--color-status-warning)] opacity-50" />
        <h3 className="text-lg font-medium">Auditoria não configurada</h3>
        <p className="text-sm mt-2">O administrador precisa configurar as colunas de auditoria nas configurações da visão.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-2">
         <Card 
            className={`p-4 cursor-pointer transition-colors ${!selectedColumnId ? 'ring-2 ring-[var(--color-brand-main)] bg-[var(--color-brand-main)]/5' : 'hover:bg-[var(--color-background-light)]'}`}
            onClick={() => setSelectedColumnId(null)}
         >
            <div className="flex flex-col h-full">
               <div className="flex items-start justify-between">
                 <div>
                   <div className="text-2xl font-semibold text-[var(--color-content-primary)]">
                     {totalNonCompliantCount}
                   </div>
                   <div className="text-xs font-medium text-[var(--color-content-secondary)] mt-1">
                     Todos com Inconformidades
                   </div>
                 </div>
                 <div className="p-2 bg-[var(--color-brand-main)]/10 text-[var(--color-brand-main)] rounded-lg shrink-0">
                    <AlertTriangle size={20} />
                 </div>
               </div>
               
               <div className="flex-1 min-h-[16px]"></div>
               <div className="mt-auto flex flex-col">
                  <div className="flex justify-between text-[10px] font-semibold mb-1.5">
                     <span className="text-[var(--color-content-tertiary)]">Status</span>
                     <span className="text-[var(--color-content-secondary)]">Geral</span>
                  </div>
                  <div className="w-full h-[3px] bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full rounded-full transition-all duration-500 bg-[var(--color-brand-main)] w-full" />
                  </div>
               </div>
            </div>
         </Card>
         
         {analysis.map(col => (
           <Card 
             key={col.id} 
             className={`p-4 cursor-pointer transition-colors ${selectedColumnId === col.id ? 'ring-2 ring-red-500 bg-red-50' : 'hover:bg-[var(--color-background-light)]'}`}
             onClick={() => setSelectedColumnId(col.id)}
           >
              <div className="flex flex-col h-full">
                 <div className="flex items-start justify-between">
                   <div>
                     <div className={`text-2xl font-semibold ${col.count > 0 ? 'text-red-600' : 'text-green-600'}`}>
                       {col.count}
                     </div>
                     <div className="text-xs font-medium text-[var(--color-content-secondary)] mt-1 line-clamp-1" title={col.label}>
                       {col.label}
                     </div>
                   </div>
                   <div className={`p-2 rounded-lg shrink-0 ${col.count > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {col.count > 0 ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
                   </div>
                 </div>
                 
                 <div className="flex-1 min-h-[16px]"></div>
                 <div className="mt-auto flex flex-col">
                    <div className="flex justify-between text-[10px] font-semibold mb-1.5">
                       <span className="text-[var(--color-content-tertiary)]">Não conformes</span>
                       <span className="text-[var(--color-content-secondary)]">
                          {((col.count / (items.length || 1)) * 100).toFixed(1)}%
                       </span>
                    </div>
                    <div className="w-full h-[3px] bg-gray-100 rounded-full overflow-hidden">
                       <div 
                          className={`h-full rounded-full transition-all duration-500 ${col.count > 0 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(100, Math.max(0, (col.count / (items.length || 1)) * 100))}%` }}
                       />
                    </div>
                 </div>
              </div>
           </Card>
         ))}
      </div>

      <div className="bg-[var(--color-content-inverse)] rounded-xl shadow-sm border border-[var(--color-border-default)] overflow-hidden flex flex-col flex-1 relative">
         <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-default)] bg-[var(--color-background-light)] rounded-t-xl shrink-0">
           <span className="text-sm font-bold text-[var(--color-content-secondary)]">
             Visão de Dados - Auditoria
           </span>
         </div>
         <div className="flex-1 overflow-auto bg-[var(--color-content-inverse)] custom-scrollbar" ref={parentRef}>
             <div className="min-w-full inline-block align-middle">
               <div className="flex flex-col">
                 <DataGridHeader 
                   columns={columns}
                   columnWidths={columnWidths}
                   sortField={sortField}
                   sortDirection={sortDirection}
                   handleSort={handleSort}
                   handleResizeMouseDown={handleResizeMouseDown}
                 />
                 <div 
                    className="relative w-full"
                    style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
                 >
                   {filteredAndSortedItems.length === 0 ? (
                     <div className="px-6 py-12 text-center text-[var(--color-content-tertiary)] font-medium">Nenhum registro encontrado para a seleção atual.</div>
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
                           onRowClick={onCardClick}
                         />
                       );
                     })
                   )}
                 </div>
               </div>
             </div>
         </div>
         <div className="bg-white border-t border-[var(--color-border-default)] px-6 py-3 flex items-center justify-between shrink-0 z-10">
             <span className="text-xs text-[var(--color-content-tertiary)]">
               Total: <span className="font-semibold text-[var(--color-content-secondary)]">{filteredAndSortedItems.length}</span> registros com não conformidades
             </span>
         </div>
      </div>
    </div>
  );
};

