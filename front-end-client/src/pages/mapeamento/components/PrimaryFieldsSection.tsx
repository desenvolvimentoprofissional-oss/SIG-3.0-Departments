import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { CollapsibleCard } from '../../../components/ui/CollapsibleCard';

interface PrimaryFieldsSectionProps {
  pageType?: 'PROCESSO' | 'CADASTRO';
  mappedPrimary: any;
  setMappedPrimary: (data: any) => void;
  availableFields: string[];
  fieldOptions: { label: string, value: string }[];
}

export const PrimaryFieldsSection: React.FC<PrimaryFieldsSectionProps> = ({
  pageType = 'PROCESSO',
  mappedPrimary,
  setMappedPrimary,
  fieldOptions
}) => {
  return (
    <div className="p-4 bg-[var(--color-background-light)] border border-[var(--color-border-default)] rounded-lg">
      <h4 className="text-sm font-bold text-[var(--color-content-primary)] mb-4">Dados Primários</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[var(--color-content-secondary)] mb-1">ID Único / Identificador</label>
          <Select value={mappedPrimary.idField || ''} onChange={(e) => setMappedPrimary({...mappedPrimary, idField: e.target.value})} options={[{value: '', label: 'Padrão (Firebase Document ID / uuid)'}, ...fieldOptions.slice(1)]} />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Status do {pageType === 'PROCESSO' ? 'Processo' : 'Registro'}</label>
          <Select value={mappedPrimary.status} onChange={(e) => setMappedPrimary({...mappedPrimary, status: e.target.value})} options={fieldOptions} />
        </div>
        
        {pageType === 'PROCESSO' && (
          <div>
            <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Número do Processo</label>
            <Select value={mappedPrimary.processNumber} onChange={(e) => setMappedPrimary({...mappedPrimary, processNumber: e.target.value})} options={fieldOptions} />
          </div>
        )}
        
        <div>
          <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Data de Criação</label>
          <Select value={mappedPrimary.createdAt} onChange={(e) => setMappedPrimary({...mappedPrimary, createdAt: e.target.value})} options={fieldOptions} />
        </div>

        {pageType === 'PROCESSO' && (
          <div>
            <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Tag/Tipo</label>
            <Select value={mappedPrimary.tagField || ''} onChange={(e) => setMappedPrimary({...mappedPrimary, tagField: e.target.value})} options={[{value: '', label: 'Selecione um campo...'}, ...fieldOptions.slice(1)]} />
          </div>
        )}
        
        <div>
          <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Nome/Razão Social</label>
          <Select value={mappedPrimary.name} onChange={(e) => setMappedPrimary({...mappedPrimary, name: e.target.value})} options={fieldOptions} />
        </div>
        
        <div>
          <label className="block text-xs text-[var(--color-content-secondary)] mb-1">CPF/CNPJ</label>
          <Select value={mappedPrimary.cpfCnpj} onChange={(e) => setMappedPrimary({...mappedPrimary, cpfCnpj: e.target.value})} options={fieldOptions} />
        </div>
        
        <div>
          <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Responsável</label>
          <Select value={mappedPrimary.responsibleEmail} onChange={(e) => setMappedPrimary({...mappedPrimary, responsibleEmail: e.target.value})} options={fieldOptions} />
        </div>
        
        <div>
          <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Avatar/Foto (URL)</label>
          <Select value={mappedPrimary.avatarField || ''} onChange={(e) => setMappedPrimary({...mappedPrimary, avatarField: e.target.value})} options={[{value: '', label: 'Selecione um campo...'}, ...fieldOptions.slice(1)]} />
        </div>

        {pageType === 'PROCESSO' && (
          <div>
            <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Tempo de Trâmite</label>
            <Select value={mappedPrimary.tramiteTimeField || ''} onChange={(e) => setMappedPrimary({...mappedPrimary, tramiteTimeField: e.target.value})} options={[{value: '', label: 'Selecione um campo...'}, ...fieldOptions.slice(1)]} />
          </div>
        )}
      </div>
    </div>
  );
};
