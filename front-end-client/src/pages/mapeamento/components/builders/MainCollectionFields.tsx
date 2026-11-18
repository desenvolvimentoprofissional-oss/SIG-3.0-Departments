import React from 'react';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { CollectionSource } from '../../../../types/index';

interface MainCollectionFieldsProps {
  collectionName: string;
  friendlyName: string;
  docName: string;
  docNameType: string;
  onUpdate: (updates: Partial<CollectionSource>) => void;
  suggestFriendlyName: (val: string) => string;
}

export const MainCollectionFields: React.FC<MainCollectionFieldsProps> = ({
  collectionName,
  friendlyName,
  docName,
  docNameType,
  onUpdate,
  suggestFriendlyName
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="flex flex-col h-full">
        <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
          Coleção Principal (Firebase)
        </label>
        <div className="mt-auto">
          <Input 
            type="text" 
            value={collectionName}
            onChange={(e) => {
              const val = e.target.value;
              onUpdate({ collectionName: val, friendlyName: suggestFriendlyName(val) });
            }}
            placeholder=""
          />
        </div>
      </div>
      <div className="flex flex-col h-full">
        <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
          Coleção Principal (Usuário)
        </label>
        <div className="mt-auto">
          <Input 
            type="text" 
            value={friendlyName}
            onChange={(e) => onUpdate({ friendlyName: e.target.value })}
            placeholder=""
          />
        </div>
      </div>
      <div className="flex flex-col h-full">
        <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
          Nome Documento (Firebase)
        </label>
        <div className="mt-auto">
          <Input 
            type="text" 
            value={docName}
            onChange={(e) => onUpdate({ docName: e.target.value })}
            placeholder=""
          />
        </div>
      </div>
      <div className="flex flex-col h-full">
        <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
          Tipo de Leitura
        </label>
        <div className="mt-auto">
          <Select
            value={docNameType}
            onChange={(e) => onUpdate({ docNameType: e.target.value as "EXACT" | "PREFIX" | "" })}
            options={[
              { label: 'Selecione', value: '', hidden: true, disabled: true },
              { label: 'Documento único', value: 'EXACT' },
              { label: 'Em partes / Prefixo', value: 'PREFIX' }
            ]}
            custom={true}
          />
        </div>
      </div>
    </div>
  );
};
