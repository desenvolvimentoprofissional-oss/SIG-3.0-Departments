import React, { useState, useMemo } from 'react';
import { createPortal } from "react-dom";
import { ResultadosConfig, ResultadoWidget, ResultadosTabConfig, TenantConfig, PageMapping } from '../../types';
import { useMappingStore } from '../../store/mappingStore';
import { useAuthStore } from '../../store/authStore';
import { useMappedConfig } from '../../hooks/useMappedConfig';
import { useMappedPageData } from '../../hooks/useMappedPageData';
import { ToolbarFilters } from './ToolbarFilters';
import { extractFilterOptions } from '../../lib/metrics.util';
import * as LucideIcons from 'lucide-react';
import { WidgetRenderer } from './WidgetRenderer';
import { Tooltip } from '../ui/Tooltip';

interface ResultadosViewProps {
  mapping: PageMapping;
  tenant: TenantConfig;
  portalTarget?: HTMLElement | null;
  onCollectionChange?: (collectionName: string) => void;
}

export const ResultadosView: React.FC<ResultadosViewProps> = ({ mapping, tenant, portalTarget, onCollectionChange }) => {
  const { pageData: allData } = useMappingStore();
  const { user } = useAuthStore();
  
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const collectionsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (collectionsRef.current && !collectionsRef.current.contains(event.target as Node)) {
        setIsCollectionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortedDataSources = useMemo(() => {
    const sources = [...(mapping.dataSources || [])];
    return sources.sort((a, b) => {
      const nameA = a.mainCollection?.friendlyName || a.mainCollection?.collectionName || '';
      const nameB = b.mainCollection?.friendlyName || b.mainCollection?.collectionName || '';
      return nameA.localeCompare(nameB);
    });
  }, [mapping.dataSources]);

  const [activeDsIndex, setActiveDsIndex] = useState(() => {
    if (sortedDataSources.length === 0) return 0;
    const defaultIndex = sortedDataSources.findIndex(ds => ds.isDefault);
    return defaultIndex >= 0 ? defaultIndex : 0;
  });

  const currentDs = sortedDataSources[activeDsIndex] || sortedDataSources[0];
  const selectedCollectionFilter = currentDs?.mainCollection?.id || currentDs?.mainCollection?.collectionName || 'ALL';

  React.useEffect(() => {
    if (onCollectionChange) {
      onCollectionChange(selectedCollectionFilter);
    }
  }, [selectedCollectionFilter, onCollectionChange]);

  const { filterFields, filterLabels, searchFields, groupingFields } = useMappedConfig(mapping, selectedCollectionFilter);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [activeGrouping, setActiveGrouping] = useState('');
  const [showMyProcesses, setShowMyProcesses] = useState(false);
  const [query, setQuery] = useState('');

  const filterOptions = useMemo(() => { 
    return extractFilterOptions(filterFields, allData, selectedCollectionFilter); 
  }, [filterFields, allData, selectedCollectionFilter]);

  const { filteredData } = useMappedPageData({
    data: allData,
    selectedCollectionFilter,
    activeFilters,
    query,
    searchFields,
    showMyProcesses,
    user
  });

  React.useEffect(() => {
    if (sortedDataSources.length > 0 && activeDsIndex >= sortedDataSources.length) {
      setActiveDsIndex(0);
    }
  }, [sortedDataSources.length, activeDsIndex]);

  const config = useMemo(() => {
    return currentDs?.resultadosConfig || mapping.resultadosConfig || { widgets: [] };
  }, [currentDs, mapping.resultadosConfig]);

  const hasDepartamento = (config?.departamentoConfig?.widgets?.length ?? 0) > 0 || (config?.departamentoConfig?.performanceCardsConfig?.metrics?.length ?? 0) > 0;
  const hasColaborador = (config?.colaboradorConfig?.widgets?.length ?? 0) > 0 || (config?.colaboradorConfig?.performanceCardsConfig?.metrics?.length ?? 0) > 0;
  const hasSerie = (config?.serieHistoricaConfig?.widgets?.length ?? 0) > 0 || (config?.serieHistoricaConfig?.performanceCardsConfig?.metrics?.length ?? 0) > 0;

  const [activeTab, setActiveTab] = useState<'COLABORADOR' | 'DEPARTAMENTO' | 'SERIE_HISTORICA'>('DEPARTAMENTO');

  React.useEffect(() => {
    if (activeTab === 'DEPARTAMENTO' && !hasDepartamento) {
      if (hasColaborador) setActiveTab('COLABORADOR');
      else if (hasSerie) setActiveTab('SERIE_HISTORICA');
    } else if (activeTab === 'COLABORADOR' && !hasColaborador) {
      if (hasDepartamento) setActiveTab('DEPARTAMENTO');
      else if (hasSerie) setActiveTab('SERIE_HISTORICA');
    } else if (activeTab === 'SERIE_HISTORICA' && !hasSerie) {
      if (hasDepartamento) setActiveTab('DEPARTAMENTO');
      else if (hasColaborador) setActiveTab('COLABORADOR');
    }
  }, [activeTab, hasDepartamento, hasColaborador, hasSerie, config]);

  const getActiveTabConfig = (): ResultadosTabConfig | undefined => {
    if (!config) return undefined;
    if (activeTab === 'COLABORADOR') return config.colaboradorConfig;
    if (activeTab === 'DEPARTAMENTO') return config.departamentoConfig;
    if (activeTab === 'SERIE_HISTORICA') return config.serieHistoricaConfig;
    return undefined;
  };

  const activeConfig = getActiveTabConfig();
  const widgetsToRender = activeConfig?.widgets || config?.widgets || [];

  const tbBtnBase = "w-7 h-7 rounded-md transition-all duration-200 flex items-center justify-center focus:outline-none shadow-[0_1px_2px_rgba(0,0,0,0.02)] border";
  const tbBtnActive = "bg-[var(--color-brand-main)]/10 text-[var(--color-brand-main)] border-[var(--color-brand-main)]/30";
  const tbBtnInactive = "bg-white border-[var(--color-border-default)]/60 text-[var(--color-content-secondary)] hover:bg-[var(--color-background-light)] hover:border-[var(--color-border-default)] hover:text-[var(--color-brand-dark)]";

  const hasResponsibleEmail = useMemo(() => {
     if (mapping.viewConfig?.primaryFields?.responsibleEmail) return true;
     if (mapping.collections) {
        return mapping.collections.some(c => c.primaryFields?.responsibleEmail);
     }
     return false;
  }, [mapping]);

  const renderTabs = () => {
    return (
      <div className="flex items-center gap-3">
        <ToolbarFilters
          mapping={mapping}
          selectedCollectionFilter={selectedCollectionFilter}
          setSelectedCollectionFilter={() => {}}
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
          availableCollections={[]}
          hasResponsibleEmail={hasResponsibleEmail}
          tbBtnBase={tbBtnBase}
          tbBtnActive={tbBtnActive}
          tbBtnInactive={tbBtnInactive}
        />
        
        {sortedDataSources.length > 1 && (
          <div className="relative" ref={collectionsRef}>
            <Tooltip content="Fontes de Dados" position="bottom">
              <button 
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)} 
                className={`${tbBtnBase} ${isCollectionsOpen ? tbBtnActive : tbBtnInactive}`}
              >
                <LucideIcons.Database size={16} />
              </button>
            </Tooltip>
            {isCollectionsOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[var(--color-border-default)] rounded-xl shadow-lg p-3 z-50 flex flex-col gap-1.5">
                <span className="text-sm font-bold text-[var(--color-content-primary)] mb-1 px-1">Fontes de Dados</span>
                {sortedDataSources.map((ds, idx) => (
                  <button
                    key={idx}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeDsIndex === idx ? 'bg-[var(--color-background-light)] text-[var(--color-brand-main)] font-semibold' : 'text-[var(--color-content-secondary)] hover:bg-[var(--color-background-light)]'}`}
                    onClick={() => { setActiveDsIndex(idx); setIsCollectionsOpen(false); }}
                  >
                    {ds.mainCollection?.friendlyName || ds.mainCollection?.collectionName || `Fonte ${idx + 1}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          {hasDepartamento && (
            <Tooltip content="Departamento" position="bottom">
              <button
                onClick={() => setActiveTab('DEPARTAMENTO')}
                className={`${tbBtnBase} ${activeTab === 'DEPARTAMENTO' ? tbBtnActive : tbBtnInactive}`}
              >
                <LucideIcons.Building size={16} />
              </button>
            </Tooltip>
          )}
          {hasColaborador && (
            <Tooltip content="Colaborador" position="bottom">
              <button
                onClick={() => setActiveTab('COLABORADOR')}
                className={`${tbBtnBase} ${activeTab === 'COLABORADOR' ? tbBtnActive : tbBtnInactive}`}
              >
                <LucideIcons.Users size={16} />
              </button>
            </Tooltip>
          )}
          {hasSerie && (
            <Tooltip content="Série Histórica" position="bottom">
              <button
                onClick={() => setActiveTab('SERIE_HISTORICA')}
                className={`${tbBtnBase} ${activeTab === 'SERIE_HISTORICA' ? tbBtnActive : tbBtnInactive}`}
              >
                <LucideIcons.History size={16} />
              </button>
            </Tooltip>
          )}
          <div className="w-px h-6 bg-[var(--color-border-default)]/60 mx-1"></div>
          <Tooltip content="Exportar Dados Abertos (CSV - Padrão LAI)" position="bottom">
          <button
            onClick={() => {
              if (!filteredData || filteredData.length === 0) return;
              
              const headers = Array.from(new Set(filteredData.flatMap(row => Object.keys(row).filter(k => typeof row[k] !== 'object'))));
              const csvContent = [
                headers.join(','),
                ...filteredData.map(row => headers.map(header => {
                  const val = row[header];
                  return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
                }).join(','))
              ].join('\n');
              
              const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.setAttribute('href', url);
              link.setAttribute('download', `export_dados_abertos_lai_${new Date().getTime()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className={`${tbBtnBase} ${tbBtnInactive}`}
          >
            <LucideIcons.Download size={16} />
          </button>
          </Tooltip>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {portalTarget && createPortal(renderTabs(), portalTarget)}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        {widgetsToRender.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[var(--color-content-tertiary)] min-h-[400px]">
            <LucideIcons.LayoutGrid size={48} className="mb-4 opacity-50 text-gray-400" />
            <p className="text-lg">Esta visão ainda não possui widgets configurados.</p>
            <p className="text-sm mt-2">Edite as propriedades desta página para adicionar os componentes desejados.</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 auto-rows-min">
            {widgetsToRender.map((widget) => (
              <div 
                key={widget.id} 
                className="bg-white border border-[var(--color-border-default)] rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col min-h-0 min-w-0"
                style={{ 
                  gridColumn: `span ${widget.layout.w}`,
                  gridRow: `span ${widget.layout.h || 4}`
                }}
              >
                <WidgetRenderer widget={widget} allData={filteredData} activeConfig={activeConfig} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
