import React from 'react';
import { Toggle } from '../../../components/ui/Toggle';
import { Input } from '../../../components/ui/Input';
import { CollapsibleCard } from '../../../components/ui/CollapsibleCard';

export const DispatchConfiguration = ({
  enableDispatchSystem, setEnableDispatchSystem,
  dispatchToOptions, setDispatchToOptions,
  dispatchStatus, setDispatchStatus,
  returnStatus, setReturnStatus,
  dispatchRelationalKey, setDispatchRelationalKey,
  fieldOptions
}: any) => {
  return (
    <CollapsibleCard 
      title="Formulário de Movimentação" 
      subtitle="Configuração de registro de saídas/devoluções de processos, mantendo histórico de quem enviou/recebeu."
      defaultOpen={false}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-[var(--color-content-primary)]">Habilitar Formulário de Movimentação</span>
        <Toggle checked={enableDispatchSystem} onChange={setEnableDispatchSystem} />
      </div>

      {enableDispatchSystem && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--color-border-default)]">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-[var(--color-content-primary)] mb-1">
              Lista Suspensa Destinatários (separado por vírgula)
            </label>
            <Input 
              placeholder="Ex: Secretaria Geral, Diretoria, Departamento Jurídico"
              value={dispatchToOptions}
              onChange={(e: any) => setDispatchToOptions(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-content-primary)] mb-1">
              Novo Status no Registro de Saída
            </label>
            <Input 
              placeholder="Ex: EM TRÂNSITO (SAÍDA)"
              value={dispatchStatus}
              onChange={(e: any) => setDispatchStatus(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-content-primary)] mb-1">
              Novo Status no Registro de Devolução
            </label>
            <Input 
              placeholder="Ex: EM ANÁLISE"
              value={returnStatus}
              onChange={(e: any) => setReturnStatus(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-content-primary)] mb-1">
              Coluna Relacional (ID Único)
            </label>
            <select
              className="w-full bg-white border border-[var(--color-border-default)] p-3 rounded-lg text-sm focus:border-[var(--color-brand-main)] outline-none"
              value={dispatchRelationalKey || ''}
              onChange={e => setDispatchRelationalKey && setDispatchRelationalKey(e.target.value)}
            >
              {fieldOptions?.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </CollapsibleCard>
  );
};
