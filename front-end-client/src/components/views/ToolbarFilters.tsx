import React, { useRef, useEffect } from 'react';
import { Database, Layers, Filter, User } from 'lucide-react';
import { Select } from '../ui/Select';
import { Tooltip } from '../ui/Tooltip';
import { PageMapping } from '../../types/index';

interface ToolbarFiltersProps {
  mapping: PageMapping;
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
  availableCollections: any[];
  hasResponsibleEmail: boolean;
  tbBtnBase: string;
  tbBtnActive: string;
  tbBtnInactive: string;
}

export const ToolbarFilters: React.FC<ToolbarFiltersProps> = ({
  selectedCollectionFilter,
  setSelectedCollectionFilter,
  groupingFields,
  activeGrouping,
  setActiveGrouping,
  filterFields,
  filterLabels = {},
  filterOptions,
  activeFilters,
  setActiveFilters,
  showMyProcesses,
  setShowMyProcesses,
  availableCollections,
  hasResponsibleEmail,
  tbBtnBase,
  tbBtnActive,
  tbBtnInactive,
}) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isGroupingOpen, setIsGroupingOpen] = React.useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = React.useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const groupingRef = useRef<HTMLDivElement>(null);
  const collectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (groupingRef.current && !groupingRef.current.contains(event.target as Node)) {
        setIsGroupingOpen(false);
      }
      if (collectionsRef.current && !collectionsRef.current.contains(event.target as Node)) {
        setIsCollectionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      
      {availableCollections.length > 1 && (
        <div className="relative" ref={collectionsRef}>
          <Tooltip content="Coleções" position="bottom">
            <button 
              onClick={() => setIsCollectionsOpen(!isCollectionsOpen)} 
              className={`${tbBtnBase} ${selectedCollectionFilter !== 'ALL' || isCollectionsOpen ? tbBtnActive : tbBtnInactive}`}
            >
              <Database size={16} />
            </button>
          </Tooltip>
          {isCollectionsOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[var(--color-border-default)] rounded-xl shadow-lg p-3 z-50 flex flex-col gap-1.5">
              <span className="text-sm font-bold text-[var(--color-content-primary)] mb-1 px-1">Coleções</span>
              <button
                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCollectionFilter === 'ALL' ? 'bg-[var(--color-background-light)] text-[var(--color-brand-main)] font-semibold' : 'text-[var(--color-content-secondary)] hover:bg-[var(--color-background-light)]'}`}
                onClick={() => { setSelectedCollectionFilter('ALL'); setIsCollectionsOpen(false); }}
              >
                Todas as Coleções
              </button>
              {availableCollections.map(c => (
                <button
                  key={c.id || c.collectionName}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCollectionFilter === (c.id || c.collectionName) ? 'bg-[var(--color-background-light)] text-[var(--color-brand-main)] font-semibold' : 'text-[var(--color-content-secondary)] hover:bg-[var(--color-background-light)]'}`}
                  onClick={() => { setSelectedCollectionFilter(c.id || c.collectionName); setIsCollectionsOpen(false); }}
                >
                  {c.friendlyName || c.collectionName}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {groupingFields.filter(f => !!f).length > 0 && (
        <div className="relative" ref={groupingRef}>
          <Tooltip content="Agrupamentos" position="bottom">
            <button 
              onClick={() => setIsGroupingOpen(!isGroupingOpen)} 
              className={`${tbBtnBase} ${activeGrouping || isGroupingOpen ? tbBtnActive : tbBtnInactive}`}
            >
              <Layers size={16} />
            </button>
          </Tooltip>
          {isGroupingOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[var(--color-border-default)] rounded-xl shadow-lg p-3 z-50 flex flex-col gap-2">
              <span className="text-sm font-bold text-[var(--color-content-primary)] mb-1 px-1">Agrupar por:</span>
              {groupingFields.filter(f => !!f).length > 0 ? (
                <Select 
                  value={activeGrouping || ''}
                  onChange={e => setActiveGrouping(e.target.value)}
                  options={[
                    { label: 'Padrão (Config. Administrativa)', value: '' },
                    ...groupingFields.filter(f => !!f).map(g => ({ label: g, value: g }))
                  ]}
                />
              ) : (
                <span className="text-xs text-[var(--color-content-tertiary)] px-1">Nenhum campo configurado para agrupamento.</span>
              )}
            </div>
          )}
        </div>
      )}

      <div className="relative" ref={filterRef}>
        <Tooltip content="Filtros" position="bottom">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)} 
            className={`${tbBtnBase} ${isFilterOpen || Object.values(activeFilters).some(v => !!v) ? tbBtnActive : tbBtnInactive}`}
          >
            <Filter size={16} />
          </button>
        </Tooltip>
        {isFilterOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[var(--color-border-default)] rounded-xl shadow-lg p-4 z-50 flex flex-col gap-4">
            {filterFields.filter(f => !!f).length > 0 ? filterFields.filter(f => !!f).map(field => (
              <div key={field} className="flex flex-col gap-1.5">
                <span className="text-sm font-bold text-[var(--color-content-primary)]">{filterLabels[field] || field}</span>
                <Select 
                  value={activeFilters[field] || ''}
                  onChange={e => setActiveFilters(prev => ({ ...prev, [field]: e.target.value }))}
                  options={[
                    { label: 'Todos', value: '' },
                    ...(filterOptions[field] || []).map(val => ({ label: val, value: val }))
                  ]}
                />
              </div>
            )) : (
              <span className="text-xs text-[var(--color-content-tertiary)]">Nenhum campo configurado para filtros.</span>
            )}
          </div>
        )}
      </div>

      {hasResponsibleEmail && (
        <div className="relative">
          <Tooltip content="Meus Processos" position="bottom">
            <button 
              onClick={() => setShowMyProcesses(!showMyProcesses)} 
              className={`${tbBtnBase} ${showMyProcesses ? tbBtnActive : tbBtnInactive}`}
            >
              <User size={16} />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};
