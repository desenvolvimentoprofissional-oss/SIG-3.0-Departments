import { logger } from "../lib/logger.util";
import { extractFilterOptions } from "../lib/metrics.util";
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { PageMapping, TenantConfig } from '../types/index';
import { useAuthStore } from '../store/authStore';
import { useSearchStore } from '../store/useSearchStore';
import { useMappingStore } from '../store/mappingStore';
import { Webhook } from 'lucide-react';
import { MappedPageDetailsSlideOver } from '../components/views/MappedPageDetailsSlideOver';
import { CreateMappedProcessModal } from './mapeamento/components/CreateMappedProcessModal';
import { MappedPageToolbar } from '../components/views/MappedPageToolbar';
import { useMappedConfig } from '../hooks/useMappedConfig';
import { useMappedPageData } from '../hooks/useMappedPageData';
import { useMappedPageHeader } from '../hooks/useMappedPageHeader';
import { useMappedPageActions } from '../hooks/useMappedPageActions';
import { MappedPageTemplateRenderer } from '../components/mapped-views/MappedPageTemplateRenderer';
import { ContentDisplayView } from '../components/views/ContentDisplayView';
import { ResultadosView } from '../components/views/ResultadosView';
import { MetricaTemplate } from '../templates/MetricaTemplate';
import { IntegrationView } from '../components/views/IntegrationView';

interface MappedPageViewProps {
  tenant: TenantConfig;
  mapping: PageMapping;
}

import { CadastroFormTemplate } from '../templates/CadastroFormTemplate';
import { CadastroTemplate } from '../templates/CadastroTemplate';

export const MappedPageView: React.FC<MappedPageViewProps> = ({ tenant, mapping }) => {
  const {
    loading,
    error,
    listenToMappingCollections,
    updateMappedDate,
    selectedCollectionFilter,
    setSelectedCollectionFilter,
    ultimaAtualizacao,
    ultimaAtualizacaoText,
    data
  } = useMappedPageHeader(tenant, mapping);

  const { 
    viewConfig, activeCollections, combinedEnabledViews, 
    searchFields, filterFields, filterLabels, groupingFields 
  } = useMappedConfig(mapping, selectedCollectionFilter);
  const [viewMode, setViewMode] = useState<string>(
    mapping.pageType === 'CADASTRO' ? 'form' : 
    (mapping.viewConfig?.kanbanColumnField ? 'kanban' : 'table')
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const { query, setQuery } = useSearchStore();
  const { user } = useAuthStore();
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [activeGrouping, setActiveGrouping] = useState<string>('');
  const [showMyProcesses, setShowMyProcesses] = useState(false);
  
  if (mapping.status === 'RASCUNHO' && user?.role !== 'MASTER' && user?.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center bg-[var(--color-background-soft)] rounded-xl border border-[var(--color-border-default)] mt-6 max-w-2xl mx-auto">
        <h3 className="text-base font-bold text-[var(--color-content-primary)] mb-2">Página em Edição</h3>
        <p className="text-sm text-[var(--color-content-secondary)]">Esta página está em modo de rascunho e sendo configurada pelos administradores do sistema.</p>
      </div>
    );
  }

  useEffect(() => {
    setPortalTarget(document.getElementById('header-portal-target'));
  }, []);

  useEffect(() => {
    if (mapping.pageType === 'CADASTRO') {
      setViewMode('form');
    } else {
      if (combinedEnabledViews.kanban) {
        setViewMode('kanban');
      } else if (combinedEnabledViews.table) {
        setViewMode('table');
      } else if (combinedEnabledViews.calendar) {
        setViewMode('calendar');
      } else if (combinedEnabledViews.matrix) {
        setViewMode('matrix');
      } else if (combinedEnabledViews.sla) {
        setViewMode('sla');
      } else {
        setViewMode('kanban');
      }
    }
  }, [mapping.pageType, combinedEnabledViews]);

  useEffect(() => {
    setActiveFilters({});
    setQuery('');
    setActiveGrouping('');
  }, [selectedCollectionFilter, setQuery]);

  const mappingFetchConfigStr = JSON.stringify({
    dataSources: mapping?.dataSources,
    collections: mapping?.collections,
    pageType: mapping?.pageType,
    viewConfig: mapping?.viewConfig
  });

  useEffect(() => {
    if (!mapping || !tenant) return;
    const unsub = listenToMappingCollections(tenant, mapping);
    return () => unsub();
    
  }, [tenant?.id, mapping?.id, mappingFetchConfigStr, listenToMappingCollections]);

  const filterOptions = useMemo(() => { return extractFilterOptions(filterFields, data, selectedCollectionFilter); 
  }, [filterFields, data, selectedCollectionFilter]);

  const { filteredData } = useMappedPageData({
    data,
    selectedCollectionFilter,
    activeFilters,
    query,
    searchFields,
    showMyProcesses,
    user
  });

  const {
    selectedCardId,
    setSelectedCardId,
    handleCardClick,
    selectedItem,
    getCardFields,
    handleDateChange
  } = useMappedPageActions({
    data,
    viewConfig,
    activeGrouping,
    tenant,
    updateMappedDate
  });

  if (mapping.pageType === 'RESULTADOS') {
    return (
      <div className="relative h-full w-full">
        {ultimaAtualizacao && (
           <div className="absolute top-3 right-8 z-[99] text-[11px] text-[var(--color-content-tertiary)] italic pointer-events-none">
             Última atualização: {ultimaAtualizacaoText}
           </div>
        )}
        <ResultadosView mapping={mapping} tenant={tenant} portalTarget={portalTarget} onCollectionChange={setSelectedCollectionFilter} />
      </div>
    );
  }

  if (mapping.pageType === 'METRICA') {
    return <MetricaTemplate mapping={mapping} tenant={tenant} portalTarget={portalTarget} />;
  }

  if (mapping.pageType === 'GALERIA' || mapping.pageType === 'LINHA_DO_TEMPO') {
    return <ContentDisplayView mapping={mapping} />;
  }

  if (mapping.pageType === 'INTEGRACAO') {
    return <IntegrationView mapping={mapping} />;
  }

  if (loading) {
    return <div className="p-8 text-center text-[var(--color-content-tertiary)]">Carregando dados...</div>;
  }

  const isCadastro = mapping.pageType === 'CADASTRO';
  const needsStrictHeight = (mapping.pageType as any) === 'INTEGRACAO' || viewMode === 'kanban' || viewMode === 'calendar' || viewMode === 'table' || viewMode === 'matrix' || viewMode === 'sla';

  return (
    <div className={`flex flex-col bg-transparent relative ${needsStrictHeight ? 'h-full overflow-hidden' : 'min-h-full'}`}>
      {(!mapping.pageType || mapping.pageType === 'PROCESSO') && ultimaAtualizacaoText && (
         <div className="absolute top-3 right-8 z-[99] text-[11px] text-[var(--color-content-tertiary)] italic pointer-events-none">
           Última atualização: {ultimaAtualizacaoText}
         </div>
      )}
      {error && (
        <div className="bg-red-50 text-[var(--color-status-error)] border border-[var(--color-status-error)] p-4 m-4 rounded">
          <p className="font-bold">Atenção:</p>
          <p>{error}</p>
        </div>
      )}
      
      <MappedPageToolbar
        portalTarget={portalTarget}
        mapping={mapping}
        isCadastro={isCadastro}
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
        viewMode={viewMode}
        setViewMode={setViewMode}
        setIsCreateModalOpen={setIsCreateModalOpen}
        combinedEnabledViews={combinedEnabledViews}
      />

      <div className={`flex-1 min-w-0 p-4 md:p-8 flex flex-col ${needsStrictHeight ? 'overflow-hidden' : ''}`}>
         <div className="flex-1 min-h-0">
            <MappedPageTemplateRenderer 
              mapping={mapping} 
              data={data} 
              paginatedData={filteredData} 
              viewMode={viewMode as string}
              isCadastro={isCadastro}
              selectedCollectionFilter={selectedCollectionFilter}
              getCardFields={getCardFields}
              handleCardClick={handleCardClick}
              handleDateChange={handleDateChange}
           />
         </div>
      </div>

      {}
      {selectedCardId && !selectedItem && (
        <div className="fixed top-10 right-10 bg-red-500 text-white p-4 z-[9999] rounded">
           Error: Selected ID {selectedCardId} not found in data!
           <button className="ml-4 underline" onClick={() => setSelectedCardId(null)}>Close</button>
        </div>
      )}
      <MappedPageDetailsSlideOver tenant={tenant} selectedItem={selectedItem} onClose={() => setSelectedCardId(null)} />
      
      {isCreateModalOpen && (
          <CreateMappedProcessModal 
             tenant={tenant}
             mapping={selectedCollectionFilter !== 'ALL' 
                 ? activeCollections.find(c => ((c as any).id || c.collectionName) === selectedCollectionFilter)!
                 : activeCollections.filter(c => c.allowCreateProcess)[0]}
             onClose={() => setIsCreateModalOpen(false)}
          />
      )}
    </div>
  );
};

