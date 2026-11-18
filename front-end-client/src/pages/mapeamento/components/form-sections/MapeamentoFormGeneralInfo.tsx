import React from 'react';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { TenantConfig, PageType } from '../../../../types';
import { getSuggestedPageName, formatPageName } from '../../../../lib/title.util';
import { useMappingStore } from '../../../../store/mappingStore';

interface MapeamentoFormGeneralInfoProps {
  tenants: TenantConfig[];
  selectedDeptId: string;
  setSelectedDeptId: (id: string) => void;
  pageType: PageType | '';
  setPageType: (type: PageType) => void;
  pageName: string;
  setPageName: (name: string) => void;
  status: 'RASCUNHO' | 'PUBLICADO' | '';
  setStatus: (status: 'RASCUNHO' | 'PUBLICADO' | '') => void;
  isEditMode: boolean;
  currentMappingId?: string;
}

export const MapeamentoFormGeneralInfo: React.FC<MapeamentoFormGeneralInfoProps> = ({
  tenants,
  selectedDeptId,
  setSelectedDeptId,
  pageType,
  setPageType,
  pageName,
  setPageName,
  status,
  setStatus,
  isEditMode,
  currentMappingId
}) => {
  const { mappings } = useMappingStore();

  const existingRestrictedTypes = React.useMemo(() => {
    if (!selectedDeptId) return new Set<string>();
    const restricted: string[] = ['CADASTRO', 'METRICA', 'PROCESSO', 'RESULTADOS'];
    const set = new Set<string>();
    mappings.forEach(m => {
      if (m.pageType && m.departmentId === selectedDeptId && restricted.includes(m.pageType)) {
        if (!currentMappingId || m.id !== currentMappingId) {
          set.add(m.pageType);
        }
      }
    });
    return set;
  }, [mappings, selectedDeptId, currentMappingId]);

  const handleDeptChange = (newDeptId: string) => {
    setSelectedDeptId(newDeptId);
    if (pageType && ['CADASTRO', 'METRICA', 'PROCESSO', 'RESULTADOS'].includes(pageType)) {
      const taken = mappings.some(
        m => m.departmentId === newDeptId && m.pageType === pageType && (!currentMappingId || m.id !== currentMappingId)
      );
      if (taken) {
        setPageType('' as PageType);
        setPageName('');
      }
    }
  };

  const handleTypeChange = (newType: PageType) => {
    setPageType(newType);
    const suggested = getSuggestedPageName(newType);
    if (suggested) {
      setPageName(suggested);
    } else if (getSuggestedPageName(pageType)) {
      setPageName('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div>
        <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Departamento</label>
        <Select 
          value={selectedDeptId} 
          onChange={(e) => handleDeptChange(e.target.value)}
          options={[
            { label: 'Selecione', value: '', hidden: true, disabled: true },
            ...tenants.map(t => ({ label: t.name, value: t.id }))
          ]}
          disabled={isEditMode}
          custom={true}
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Tipo de Página</label>
        <Select
          value={pageType}
          onChange={(e) => handleTypeChange(e.target.value as PageType)}
          options={[
            { label: 'Selecione', value: '', hidden: true, disabled: true },
            { label: 'Cadastro', value: 'CADASTRO', disabled: existingRestrictedTypes.has('CADASTRO') },
            { label: 'Galeria', value: 'GALERIA' },
            { label: 'Integração', value: 'INTEGRACAO' },
            { label: 'Linha do Tempo', value: 'LINHA_DO_TEMPO' },
            { label: 'Métrica', value: 'METRICA', disabled: existingRestrictedTypes.has('METRICA') },
            { label: 'Processo', value: 'PROCESSO', disabled: existingRestrictedTypes.has('PROCESSO') },
            { label: 'Resultado', value: 'RESULTADOS', disabled: existingRestrictedTypes.has('RESULTADOS') }
          ]}
          disabled={isEditMode || !selectedDeptId}
          custom={true}
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Nome da Página</label>
        <Input 
          value={pageName} 
          onChange={(e) => setPageName(formatPageName(e.target.value))}
          onBlur={(e) => setPageName(formatPageName(e.target.value.trim()))}
          placeholder="" 
          maxLength={35}
          disabled={!!getSuggestedPageName(pageType)}
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">Status da Página</label>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'RASCUNHO' | 'PUBLICADO')}
          options={[
            { label: 'Selecione', value: '', hidden: true, disabled: true },
            { label: 'Publicado', value: 'PUBLICADO' },
            { label: 'Rascunho', value: 'RASCUNHO' }
          ]}
          custom={true}
        />
      </div>
    </div>
  );
};
