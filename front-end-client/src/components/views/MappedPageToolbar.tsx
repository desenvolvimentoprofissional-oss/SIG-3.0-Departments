import React from 'react';
import { Database, Layers, Filter, User, List, BarChart2, LayoutGrid, Calendar, FileText, Grid3X3, Timer, LayoutDashboard, PieChart, Activity, TrendingUp, Clock, ClipboardCheck } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/Button';
import { PageMapping } from '../../types/index';
import { ToolbarFilters } from './ToolbarFilters';
import { Tooltip } from '../ui/Tooltip';

interface MappedPageToolbarProps {
  portalTarget: HTMLElement | null;
  mapping: PageMapping;
  isCadastro: boolean;
  selectedCollectionFilter: string;
  setSelectedCollectionFilter: (val: string) => void;
  groupingFields: string[];
  activeGrouping: string;
  setActiveGrouping: (val: string) => void;
  filterFields: string[];
  filterLabels?: Record<string, string>;
  filterOptions: Record<string, string[]>;
  activeFilters: Record<string, string>;
  setActiveFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  showMyProcesses: boolean;
  setShowMyProcesses: (val: boolean) => void;
  viewMode: string;
  setViewMode: (val: any) => void;
  setIsCreateModalOpen: (val: boolean) => void;
  combinedEnabledViews?: { kanban: boolean; list: boolean; calendar: boolean; table: boolean; matrix: boolean; sla: boolean; auditoria?: boolean };
}

export const MappedPageToolbar: React.FC<MappedPageToolbarProps> = ({
  portalTarget,
  mapping,
  isCadastro,
  selectedCollectionFilter,
  setSelectedCollectionFilter,
  groupingFields,
  activeGrouping,
  setActiveGrouping,
  filterFields,
  filterLabels,
  filterOptions,
  activeFilters,
  setActiveFilters,
  showMyProcesses,
  setShowMyProcesses,
  viewMode,
  setViewMode,
  setIsCreateModalOpen,
  combinedEnabledViews
}) => {
  const availableCollections = React.useMemo(() => {
    let base = mapping.collections || [];
    if (mapping.dataSources && mapping.dataSources.length > 0) {
      base = mapping.dataSources.reduce((acc, ds) => {
         if (ds.mainCollection) acc.push(ds.mainCollection);
         return acc;
      }, [] as any[]);
    }
    return base.sort((a: any, b: any) => {
      const nameA = a.friendlyName || a.collectionName || '';
      const nameB = b.friendlyName || b.collectionName || '';
      return nameA.localeCompare(nameB);
    });
  }, [mapping]);

  const hasResponsibleEmail = React.useMemo(() => {
     if (mapping.viewConfig?.primaryFields?.responsibleEmail) return true;
     if (mapping.collections) {
        return mapping.collections.some(c => c.primaryFields?.responsibleEmail);
     }
     return false;
  }, [mapping]);

  const tbBtnBase = "w-7 h-7 rounded-md transition-all duration-200 flex items-center justify-center focus:outline-none shadow-[0_1px_2px_rgba(0,0,0,0.02)] border";
  const tbBtnActive = "bg-[var(--color-brand-main)]/10 text-[var(--color-brand-main)] border-[var(--color-brand-main)]/30";
  const tbBtnInactive = "bg-white border-[var(--color-border-default)]/60 text-[var(--color-content-secondary)] hover:bg-[var(--color-background-light)] hover:border-[var(--color-border-default)] hover:text-[var(--color-brand-dark)]";

  if (!portalTarget) return null;

  return createPortal(
    <>
      <ToolbarFilters 
        mapping={mapping}
        selectedCollectionFilter={selectedCollectionFilter}
        setSelectedCollectionFilter={setSelectedCollectionFilter}
        groupingFields={groupingFields}
        activeGrouping={activeGrouping}
        setActiveGrouping={setActiveGrouping}
        filterFields={filterFields}
              filterLabels={filterLabels}
        filterOptions={filterOptions}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        showMyProcesses={showMyProcesses}
        setShowMyProcesses={setShowMyProcesses}
        availableCollections={availableCollections}
        hasResponsibleEmail={hasResponsibleEmail}
        tbBtnBase={tbBtnBase}
        tbBtnActive={tbBtnActive}
        tbBtnInactive={tbBtnInactive}
      />
      
      {isCadastro ? (
        <div className="flex items-center gap-1.5">
          <Tooltip content="Formulário" position="bottom">
            <button 
              onClick={() => setViewMode('form')}
              className={`${tbBtnBase} ${viewMode === 'form' ? tbBtnActive : tbBtnInactive}`}
            >
              <List size={16} />
            </button>
          </Tooltip>
          <Tooltip content="Dashboard" position="bottom">
            <button 
              onClick={() => setViewMode('dashboard')}
              className={`${tbBtnBase} ${viewMode === 'dashboard' ? tbBtnActive : tbBtnInactive}`}
            >
              <BarChart2 size={16} />
            </button>
          </Tooltip>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          {(!combinedEnabledViews || combinedEnabledViews.kanban) && (
            <Tooltip content="Quadro" position="bottom">
              <button 
                onClick={() => setViewMode('kanban')}
                className={`${tbBtnBase} ${viewMode === 'kanban' ? tbBtnActive : tbBtnInactive}`}
              >
                <LayoutGrid size={16} />
              </button>
            </Tooltip>
          )}
          {(!combinedEnabledViews || combinedEnabledViews.calendar) && (
            <Tooltip content="Calendário" position="bottom">
              <button 
                onClick={() => setViewMode('calendar')}
                className={`${tbBtnBase} ${viewMode === 'calendar' ? tbBtnActive : tbBtnInactive}`}
              >
                <Calendar size={16} />
              </button>
            </Tooltip>
          )}
          {(!combinedEnabledViews || combinedEnabledViews.table) && (
            <Tooltip content="Tabela" position="bottom">
              <button 
                onClick={() => setViewMode('table')}
                className={`${tbBtnBase} ${viewMode === 'table' ? tbBtnActive : tbBtnInactive}`}
              >
                <FileText size={16} />
              </button>
            </Tooltip>
          )}
          {(!combinedEnabledViews || combinedEnabledViews.matrix) && (
            <Tooltip content="Matriz" position="bottom">
              <button 
                onClick={() => setViewMode('matrix')}
                className={`${tbBtnBase} ${viewMode === 'matrix' ? tbBtnActive : tbBtnInactive}`}
              >
                <Grid3X3 size={16} />
              </button>
            </Tooltip>
          )}
          {(!combinedEnabledViews || combinedEnabledViews.sla) && (
            <Tooltip content="SLA (Gantt)" position="bottom">
              <button 
                onClick={() => setViewMode('sla')}
                className={`${tbBtnBase} ${viewMode === 'sla' ? tbBtnActive : tbBtnInactive}`}
              >
                <Timer size={16} />
              </button>
            </Tooltip>
          )}
          {(combinedEnabledViews?.auditoria) && (
            <Tooltip content="Auditoria" position="bottom">
              <button 
                onClick={() => setViewMode('auditoria')}
                className={`${tbBtnBase} ${viewMode === 'auditoria' ? tbBtnActive : tbBtnInactive}`}
              >
                <ClipboardCheck size={16} />
              </button>
            </Tooltip>
          )}
        </div>
      )}

      {!isCadastro && selectedCollectionFilter !== 'ALL' && availableCollections.find(c => ((c as any).id || c.collectionName) === selectedCollectionFilter)?.allowCreateProcess && (
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          Novo Processo
        </Button>
      )}
      {!isCadastro && selectedCollectionFilter === 'ALL' && availableCollections.filter(c => c.allowCreateProcess).length === 1 && (
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          Novo Processo
        </Button>
      )}
      {isCadastro && selectedCollectionFilter !== 'ALL' && availableCollections.find(c => ((c as any).id || c.collectionName) === selectedCollectionFilter)?.allowCreateProcess && (
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          Novo Registro
        </Button>
      )}
      {isCadastro && selectedCollectionFilter === 'ALL' && availableCollections.filter(c => c.allowCreateProcess).length === 1 && (
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          Novo Registro
        </Button>
      )}
    </>,
    portalTarget
  );
};
