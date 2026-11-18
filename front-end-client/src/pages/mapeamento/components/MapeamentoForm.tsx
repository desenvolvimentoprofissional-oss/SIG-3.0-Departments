import React, { useState } from 'react';
import { PageMapping, TenantConfig, PageType, DataSourceConfig, ViewMappingConfig, ContentItem } from '../../../types/index';
import { Input } from '../../../components/ui/Input';
import { X, Info } from 'lucide-react';
import { ContentItemsManager } from './ContentItemsManager';
import { MetricaBuilder } from './MetricaBuilder';
import { SharePageModal } from './SharePageModal';
import { getSuggestedPageName, formatPageName } from '../../../lib/title.util';
import { useMappingStore } from '../../../store/mappingStore';
import { CollapsibleCard } from '../../../components/ui/CollapsibleCard';

import { MapeamentoFormHeader } from './form-sections/MapeamentoFormHeader';
import { MapeamentoFormGeneralInfo } from './form-sections/MapeamentoFormGeneralInfo';
import { MapeamentoFormDataSources } from './form-sections/MapeamentoFormDataSources';

interface MapeamentoFormProps {
  initialMapping: PageMapping | null;
  tenants: TenantConfig[];
  onCancel: () => void;
  onSave: (mapping: PageMapping, targetTenant: TenantConfig) => Promise<void>;
}

export const MapeamentoForm: React.FC<MapeamentoFormProps> = ({ initialMapping, tenants, onCancel, onSave }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [mappingId] = useState<string>(initialMapping?.id || Date.now().toString(36) + Math.random().toString(36).substring(2));
  const [pageName, setPageName] = useState(() => {
    if (initialMapping) {
      const suggested = getSuggestedPageName(initialMapping.pageType);
      return suggested || initialMapping.pageName || '';
    }
    return '';
  });
  const [pageType, setPageType] = useState<PageType | ''>(initialMapping?.pageType || '');
  const [iframeUrl, setIframeUrl] = useState(initialMapping?.iframeUrl || '');
  const [passUserInfo, setPassUserInfo] = useState<boolean>(initialMapping?.passUserInfo || false);
  
  const [contentItems, setContentItems] = useState<ContentItem[]>(
    [...(initialMapping?.contentItems || [])].sort((a, b) => (a.order || 0) - (b.order || 0))
  );
  
  const [selectedDeptId, setSelectedDeptId] = useState(initialMapping?.departmentId || '');
  const [status, setStatus] = useState<'RASCUNHO' | 'PUBLICADO' | ''>(initialMapping?.status || '');
  const [dataSources, setDataSources] = useState<DataSourceConfig[]>(initialMapping?.dataSources || ((initialMapping as any)?.dataSource ? [(initialMapping as any).dataSource] : []));
  const [viewConfig, setViewConfig] = useState<ViewMappingConfig | undefined>(initialMapping?.viewConfig);
  const [resultadosConfig, setResultadosConfig] = useState<any>(initialMapping?.resultadosConfig || { widgets: [] });

  const computeInitialFields = (dss?: DataSourceConfig[]) => {
    if (!dss || dss.length === 0) return [];
    const list: string[] = [];
    dss.forEach(ds => {
      if (ds.mainCollection?.collectionName && ds.mainCollection.extractedFields) {
        ds.mainCollection.extractedFields.forEach(f => list.push(f));
      }
      ds.relationalCollections?.forEach(rel => {
        if (rel.collectionName && rel.extractedFields) {
          rel.extractedFields.forEach(f => list.push(f));
        }
      });
    });
    return Array.from(new Set(list));
  };

  const [extractedFields, setExtractedFields] = useState<string[]>(computeInitialFields(initialMapping?.dataSources || ((initialMapping as any)?.dataSource ? [(initialMapping as any).dataSource] : [])));
  const [errorMsg, setErrorMsg] = useState('');

  const handleSavePage = async () => {
    const suggested = getSuggestedPageName(pageType);
    if (!pageName && !suggested) return;
    if (!selectedDeptId) return;

    const restrictedTypes: PageType[] = ['PROCESSO', 'CADASTRO', 'RESULTADOS', 'METRICA'];
    if (restrictedTypes.includes(pageType as PageType)) {
      const { mappings } = useMappingStore.getState();
      const alreadyExists = mappings.some(
        m => m.departmentId === selectedDeptId && m.pageType === pageType && m.id !== initialMapping?.id
      );
      if (alreadyExists) {
        setErrorMsg(`Este departamento já possui uma página do tipo "${pageType}". Apenas uma página deste tipo é permitida por departamento.`);
        return;
      }
    }

    if (['PROCESSO', 'CADASTRO', 'RESULTADOS', 'METRICA'].includes(pageType) && dataSources.length === 0) {
      setErrorMsg('Pelo menos uma fonte de dados é obrigatória para este tipo de página.');
      return;
    }

    if (!status) {
      setErrorMsg('Selecione o status da página (Publicado ou Rascunho).');
      return;
    }
    
    setErrorMsg('');
    const targetTenant = tenants.find(t => t.id === selectedDeptId);
    if (!targetTenant) return;

    const newMapping: PageMapping = {
      ...initialMapping,
      id: mappingId,
      departmentId: selectedDeptId,
      pageName: suggested || formatPageName(pageName),
      pageType: pageType as PageType,
      status: status as 'RASCUNHO' | 'PUBLICADO',
      iframeUrl: pageType === 'INTEGRACAO' ? iframeUrl : undefined,
      passUserInfo: pageType === 'INTEGRACAO' ? passUserInfo : undefined,
      contentItems: (pageType === 'GALERIA' || pageType === 'LINHA_DO_TEMPO') ? contentItems : undefined,
      dataSources: (pageType !== 'INTEGRACAO' && pageType !== 'GALERIA' && pageType !== 'LINHA_DO_TEMPO') ? dataSources : undefined,
      viewConfig: (pageType === 'PROCESSO' || pageType === 'CADASTRO') ? viewConfig : undefined,
      resultadosConfig: pageType === 'RESULTADOS' ? resultadosConfig : undefined,
      collections: [],
      createdAt: initialMapping?.createdAt || Date.now(),
      updatedAt: Date.now()
    };
    
    try {
      await onSave(newMapping, targetTenant);
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <MapeamentoFormHeader 
        selectedDeptId={selectedDeptId}
        pageName={pageName}
        onCancel={onCancel}
        onSave={handleSavePage}
        onShare={() => setIsShareModalOpen(true)}
      />

      {errorMsg && (
        <div className="mx-6 md:mx-10 mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center">
          <div className="mr-3 p-1 bg-red-100 rounded-full">
            <X size={16} className="text-red-600" />
          </div>
          <div>
            <span className="font-bold block mb-1">Aviso</span>
            {errorMsg}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto p-3 sm:p-6 custom-scrollbar flex flex-col items-center">
        <div className="w-full max-w-7xl space-y-6 pb-12">
          <div className="bg-white rounded-xl border border-[var(--color-border-default)] shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-sm font-bold text-[var(--color-content-primary)]">Configuração Geral</h3>
              <div className="relative group/info inline-flex items-center cursor-help">
                <Info size={14} className="text-[var(--color-content-tertiary)] hover:text-[var(--color-brand-main)] transition-colors shrink-0" />
                <div className="absolute left-0 sm:left-full sm:ml-2.5 top-full sm:top-1/2 mt-1.5 sm:mt-0 sm:-translate-y-1/2 z-[999] bg-[var(--color-background-dark)] text-[var(--color-content-inverse)] text-[12px] font-normal px-3.5 py-2 rounded-xl shadow-xl pointer-events-none opacity-0 group-hover/info:opacity-100 transition-all duration-200 w-max max-w-[240px] sm:max-w-md leading-relaxed">
                  Selecione o departamento, o tipo de visualização da página, o status de publicação e defina um nome identificador.
                </div>
              </div>
            </div>
            <MapeamentoFormGeneralInfo 
              tenants={tenants}
              selectedDeptId={selectedDeptId}
              setSelectedDeptId={setSelectedDeptId}
              pageType={pageType}
              setPageType={setPageType}
              pageName={pageName}
              setPageName={setPageName}
              status={status}
              setStatus={setStatus}
              isEditMode={!!initialMapping}
              currentMappingId={initialMapping?.id}
            />
          </div>

          {pageType === 'INTEGRACAO' && status && (
            <CollapsibleCard 
              title="Configuração da Integração" 
              subtitle="Informe o endereço URL do iFrame externo e permissões de repasse de dados do usuário" 
              defaultOpen={true}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="md:col-span-2 flex flex-col justify-between">
                  <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">URL (iFrame Target)</label>
                  <Input value={iframeUrl} onChange={(e) => setIframeUrl(e.target.value)} placeholder="https://exemplo.com/app" />
                </div>
                <div className="md:col-span-1 flex flex-col justify-end pb-1.5">
                  <label className="flex items-center space-x-2.5 cursor-pointer p-2.5 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-background-soft)] hover:bg-slate-100/80 transition-colors">
                    <input
                      type="checkbox"
                      checked={passUserInfo}
                      onChange={(e) => setPassUserInfo(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-[var(--color-brand-main)] rounded border-gray-300 focus:ring-[var(--color-brand-main)]"
                    />
                    <span className="text-sm font-medium text-[var(--color-content-primary)]">Repassar email do usuário?</span>
                  </label>
                </div>
              </div>
            </CollapsibleCard>
          )}

          {['PROCESSO', 'CADASTRO', 'RESULTADOS'].includes(pageType) && selectedDeptId && status && (
            <MapeamentoFormDataSources 
              dataSources={dataSources}
              setDataSources={setDataSources}
              pageType={pageType as PageType}
              selectedDeptId={selectedDeptId}
              tenants={tenants}
              viewConfig={viewConfig}
              setViewConfig={setViewConfig}
              resultadosConfig={resultadosConfig}
              setResultadosConfig={setResultadosConfig}
              computeInitialFields={computeInitialFields}
              setExtractedFields={setExtractedFields}
            />
          )}

          {pageType === 'METRICA' && selectedDeptId && status && (
            <MetricaBuilder 
              config={dataSources[0] || { mainCollection: null, relationalCollections: [] }}
              onChange={(cfg) => {
                const newDs = [...dataSources];
                newDs[0] = cfg;
                setDataSources(newDs);
                setExtractedFields(computeInitialFields(newDs));
              }}
            />
          )}

          {(pageType === 'GALERIA' || pageType === 'LINHA_DO_TEMPO') && status && (
            <ContentItemsManager
              items={contentItems}
              onChange={setContentItems}
              pageType={pageType}
            />
          )}

          {selectedDeptId && (
            <SharePageModal 
              isOpen={isShareModalOpen} 
              onClose={() => setIsShareModalOpen(false)} 
              mappingId={mappingId} 
              departmentId={selectedDeptId} 
              departmentArea={tenants.find(t => t.id === selectedDeptId)?.area || ''}
              pageName={pageName} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

