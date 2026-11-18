import React from 'react';
import { Loader2, CheckCircle2, Database, EyeOff, Eye, Trash2 } from 'lucide-react';
import { renderExtractedPills } from './ExtractedPills';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';

export const RelationalCollectionItem = ({
  rel,
  idx,
  updateRelational,
  suggestFriendlyName,
  fetchCollectionSchema,
  loadingCol,
  hasRelFields,
  toggleRel,
  isRelOpen,
  removeRelational
}: any) => {
  return (
    <div key={rel.id} className="mt-6 pt-6 border-t border-[var(--color-border-default)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-default)]/60 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--color-content-primary)] uppercase tracking-wider">
            Coleção Relacional {idx + 1}
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap justify-end">
          <div className="relative group/btn inline-flex items-center">
            <button
              type="button"
              onClick={() => fetchCollectionSchema(rel.collectionName, false, idx, rel.docName, rel.docNameType)}
              disabled={loadingCol === rel.collectionName || !rel.collectionName}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm border border-[var(--color-border-default)] bg-white hover:bg-slate-50 hover:border-[var(--color-brand-main)] disabled:opacity-50"
            >
              {loadingCol === rel.collectionName ? (
                <Loader2 size={16} className="animate-spin text-[var(--color-brand-main)]" />
              ) : hasRelFields ? (
                <CheckCircle2 size={16} className="text-green-600" />
              ) : (
                <Database size={16} className="text-[var(--color-brand-main)]" />
              )}
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-[999] bg-[var(--color-background-dark)] text-[var(--color-content-inverse)] text-[12px] font-medium px-3 py-1.5 rounded-xl shadow-sm pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-all duration-200 whitespace-nowrap">
              {hasRelFields ? 'Conectado — Clique para Atualizar' : 'Conectar Relacional ao Firebase'}
            </div>
          </div>

          {hasRelFields && (
            <div className="relative group/btn inline-flex items-center">
              <button
                type="button"
                onClick={() => toggleRel(rel.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm border border-[var(--color-border-default)] bg-white hover:bg-slate-50 text-[var(--color-content-secondary)] hover:text-[var(--color-content-primary)]"
              >
                {isRelOpen ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-[999] bg-[var(--color-background-dark)] text-[var(--color-content-inverse)] text-[12px] font-medium px-3 py-1.5 rounded-xl shadow-sm pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-all duration-200 whitespace-nowrap">
                {isRelOpen ? 'Ocultar Cabeçalhos' : 'Ver Cabeçalhos'}
              </div>
            </div>
          )}

          <div className="relative group/btn inline-flex items-center">
            <button
              type="button"
              onClick={() => removeRelational(idx)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm border border-[var(--color-border-default)] hover:border-red-200 bg-white hover:bg-red-50 text-red-600"
            >
              <Trash2 size={16} />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-[999] bg-[var(--color-background-dark)] text-[var(--color-content-inverse)] text-[12px] font-medium px-3 py-1.5 rounded-xl shadow-sm pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-all duration-200 whitespace-nowrap">
              Remover Coleção
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex flex-col h-full">
          <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
            Coleção Relacional (Firebase)
          </label>
          <div className="mt-auto">
            <Input 
              type="text" 
              value={rel.collectionName}
              onChange={(e) => {
                const val = e.target.value;
                updateRelational(idx, { collectionName: val, friendlyName: suggestFriendlyName(val) });
              }}
              placeholder=""
            />
          </div>
        </div>
        <div className="flex flex-col h-full">
          <label className="block text-[11px] font-semibold text-[var(--color-content-secondary)] uppercase tracking-wider mb-1.5">
            Coleção Relacional (Usuário)
          </label>
          <div className="mt-auto">
            <Input 
              type="text" 
              value={rel.friendlyName || ''}
              onChange={(e) => updateRelational(idx, { friendlyName: e.target.value })}
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
              value={rel.docName || ''}
              onChange={(e) => updateRelational(idx, { docName: e.target.value })}
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
              value={rel.docNameType || ''}
              onChange={(e) => updateRelational(idx, { docNameType: e.target.value as "EXACT" | "PREFIX" | "" })}
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
      
      {hasRelFields && isRelOpen && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {renderExtractedPills(rel.extractedFields)}
        </div>
      )}
    </div>
  );
};
