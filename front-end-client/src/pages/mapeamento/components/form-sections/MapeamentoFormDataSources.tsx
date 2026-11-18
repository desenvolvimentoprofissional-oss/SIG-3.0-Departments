import React from 'react';
import { DataSourceConfig, PageType, TenantConfig, ViewMappingConfig } from '../../../../types';
import { Button } from '../../../../components/ui/Button';
import { CollapsibleCard } from '../../../../components/ui/CollapsibleCard';
import { Plus, Database } from 'lucide-react';
import { DataSourceSelector } from '../DataSourceSelector';
import { ViewConfigForm } from '../ViewConfigForm';
import { ResultadosBuilder } from '../ResultadosBuilder';
import { ResultadosFilterConfig } from './ResultadosFilterConfig';

interface MapeamentoFormDataSourcesProps {
  dataSources: DataSourceConfig[];
  setDataSources: (dss: DataSourceConfig[]) => void;
  pageType: PageType;
  selectedDeptId: string;
  tenants: TenantConfig[];
  viewConfig?: ViewMappingConfig;
  setViewConfig: (cfg: ViewMappingConfig) => void;
  resultadosConfig: any;
  setResultadosConfig: (cfg: any) => void;
  computeInitialFields: (dss: DataSourceConfig[]) => string[];
  setExtractedFields: (fields: string[]) => void;
}

export const MapeamentoFormDataSources: React.FC<MapeamentoFormDataSourcesProps> = ({
  dataSources,
  setDataSources,
  pageType,
  selectedDeptId,
  tenants,
  viewConfig,
  setViewConfig,
  resultadosConfig,
  setResultadosConfig,
  computeInitialFields,
  setExtractedFields
}) => {
  const [activeTab, setActiveTab] = React.useState<number>(0);
  const currentTabIndex = activeTab < dataSources.length ? activeTab : 0;
  const currentDs = dataSources[currentTabIndex];
  const currentFields = currentDs ? computeInitialFields([currentDs]) : [];
  
  const currentFieldOptions = React.useMemo(() => {
    if (!currentDs) return [];
    
    const options: { value: string; label: string }[] = [{ value: '', label: 'Selecione um campo...' }];
    const mainCol = currentDs.mainCollection;
    
    if (mainCol?.extractedFields) {
      const mainName = mainCol.friendlyName || mainCol.collectionName || 'Principal';
      mainCol.extractedFields.forEach(f => {
        options.push({ value: f, label: `[${mainName}] ${f}` });
      });
    }
    
    if (currentDs.relationalCollections) {
      currentDs.relationalCollections.forEach(rel => {
        if (rel.extractedFields) {
          const relName = rel.friendlyName || rel.collectionName || 'Relacional';
          rel.extractedFields.forEach(f => {
            options.push({ value: f, label: `[${relName}] ${f}` });
          });
        }
      });
    }
    
    // Remove duplicate values if they exist, keeping the first occurrence
    const uniqueOptions = options.filter((v, i, a) => a.findIndex(t => (t.value === v.value)) === i);
    return uniqueOptions;
  }, [currentDs]);

  if (!['PROCESSO', 'CADASTRO', 'RESULTADOS'].includes(pageType) || !selectedDeptId) {
    return null;
  }

  const getSpecificitiesTitle = () => {
    switch (pageType) {
      case 'CADASTRO': return 'Configuração de Cadastro';
      case 'PROCESSO': return 'Configuração de Processo';
      case 'RESULTADOS': return 'Configuração de Resultados';
      default: return 'Configuração da Página';
    }
  };

  const getSpecificitiesSubtitle = () => {
    switch (pageType) {
      case 'CADASTRO': return 'Defina a visualização tabular de cadastros, colunas e campos editáveis';
      case 'PROCESSO': return 'Estruture as etapas, fluxos operacionais, colunas de Kanban e campos dos processos';
      case 'RESULTADOS': return 'Defina indicadores de metas, gráficos, widgets e filtros analíticos';
      default: return 'Configure as opções específicas deste tipo de página';
    }
  };

  return (
    <div className="space-y-6">
      <CollapsibleCard 
        title="Coleções do Banco de Dados (Firebase)" 
        subtitle="Selecione a coleção principal e coleções relacionais no Firebase que alimentarão os dados desta página" 
        defaultOpen={true}
      >
        <div className="space-y-8 pt-2">
          {dataSources.map((ds, index) => (
            <div 
              key={index} 
              className={`space-y-6 relative ${
                dataSources.length > 1 
                  ? 'p-5 bg-slate-50/50 border border-[var(--color-border-default)] rounded-xl mt-6 first:mt-0' 
                  : ''
              }`}
            >
              <DataSourceSelector 
                tenant={tenants.find(t => t.id === selectedDeptId)!}
                config={ds}
                onChange={(cfg) => {
                  const newDs = [...dataSources];
                  newDs[index] = { ...newDs[index], ...cfg };
                  setDataSources(newDs);
                  setExtractedFields(computeInitialFields(newDs));
                }}
                index={index}
                totalSources={dataSources.length}
                pageType={pageType}
                isDefault={!!ds.isDefault}
                onSetDefault={() => {
                  const newDs = dataSources.map((d, i) => ({ ...d, isDefault: i === index }));
                  setDataSources(newDs);
                }}
                onRemove={() => {
                  const newDs = [...dataSources];
                  newDs.splice(index, 1);
                  setDataSources(newDs);
                  setExtractedFields(computeInitialFields(newDs));
                }}
              />
            </div>
          ))}

          <div className="pt-4 border-t border-[var(--color-border-default)]">
            <Button
              type="button"
              variant="secondary"
              className="w-full py-3 border-dashed border-2 text-xs text-[var(--color-content-secondary)] hover:text-[var(--color-brand-main)] hover:border-[var(--color-brand-main)] hover:bg-[var(--color-brand-main)]/5"
              onClick={() => {
                const isFirst = dataSources.length === 0;
                setDataSources([...dataSources, { mainCollection: null, relationalCollections: [], isDefault: isFirst }]);
              }}
            >
              <Plus size={16} className="mr-2" />
              Adicionar Nova Configuração
            </Button>
          </div>
        </div>
      </CollapsibleCard>

      {dataSources.length > 0 && (
        <CollapsibleCard 
          title={getSpecificitiesTitle()} 
          subtitle={getSpecificitiesSubtitle()} 
          defaultOpen={true}
        >
          <div className="pt-2">
            <div 
              className="flex w-full border-b border-[var(--color-border-default)] mb-6 overflow-x-auto no-scrollbar" 
              role="tablist" 
              aria-label="Coleções mapeadas para configuração"
            >
              {dataSources.map((ds, idx) => {
                const isActive = currentTabIndex === idx;
                const tabLabel = ds.mainCollection?.friendlyName || ds.mainCollection?.collectionName || `Fonte ${idx + 1}`;

                return (
                  <button
                    key={`tab-${idx}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(idx)}
                    className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-b-2 -mb-px whitespace-nowrap flex items-center justify-center ${
                      isActive
                        ? 'border-[var(--color-brand-main)] text-[var(--color-brand-main)] bg-[var(--color-brand-main)]/5'
                        : 'border-transparent text-[var(--color-content-secondary)] hover:text-[var(--color-content-primary)] hover:bg-slate-50'
                    }`}
                  >
                    <span>{tabLabel}</span>
                  </button>
                );
              })}
            </div>

            {currentDs && (
              <div key={`tab-content-${currentTabIndex}`} className="space-y-6">
                {currentFields.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50/80 rounded-xl border border-dashed border-[var(--color-border-default)]">
                    <Database size={32} className="mx-auto text-slate-400 mb-3" />
                    <h4 className="text-sm font-semibold text-[var(--color-content-primary)] mb-1">
                      Coleção pendente de configuração
                    </h4>
                    <p className="text-xs text-[var(--color-content-secondary)] max-w-md mx-auto">
                      Para configurar os detalhes operacionais desta aba ({currentDs.mainCollection?.friendlyName || currentDs.mainCollection?.collectionName || `Fonte ${currentTabIndex + 1}`}), selecione e carregue uma coleção principal no Card 2 acima (Coleções do Banco de Dados).
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {['PROCESSO', 'CADASTRO'].includes(pageType) && (
                      <div>
                        <ViewConfigForm 
                          key={`view-config-tab-${currentTabIndex}-${currentDs.mainCollection?.collectionName || 'new'}`}
                          pageType={pageType as 'CADASTRO' | 'PROCESSO'}
                          extractedFields={currentFields}
                          customFieldOptions={currentFieldOptions}
                          initialConfig={currentDs.viewConfig || (currentTabIndex === 0 ? viewConfig : undefined)}
                          onSave={(cfg) => {
                            const newDs = [...dataSources];
                            newDs[currentTabIndex] = { ...newDs[currentTabIndex], viewConfig: cfg };
                            setDataSources(newDs);
                            if (currentTabIndex === 0) setViewConfig(cfg);
                          }}
                          onCancel={() => {}}
                        />
                      </div>
                    )}
                    
                    {pageType === 'RESULTADOS' && (
                      <div className="space-y-4">
                        <ResultadosBuilder
                          config={currentDs.resultadosConfig || (currentTabIndex === 0 ? resultadosConfig : undefined)}
                          onChange={(cfg) => {
                            const newDs = [...dataSources];
                            newDs[currentTabIndex] = { ...newDs[currentTabIndex], resultadosConfig: cfg };
                            setDataSources(newDs);
                            if (currentTabIndex === 0) setResultadosConfig(cfg);
                          }}
                          dataSources={[currentDs]}
                          tenantId={selectedDeptId}
                        />
                        <ResultadosFilterConfig
                          extractedFields={currentFields}
                          customFieldOptions={currentFieldOptions}
                          initialConfig={currentDs.viewConfig || (currentTabIndex === 0 ? viewConfig : undefined)}
                          onChange={(cfg) => {
                            const newDs = [...dataSources];
                            newDs[currentTabIndex] = { ...newDs[currentTabIndex], viewConfig: cfg };
                            setDataSources(newDs);
                            if (currentTabIndex === 0) setViewConfig(cfg);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </CollapsibleCard>
      )}
    </div>
  );
};
