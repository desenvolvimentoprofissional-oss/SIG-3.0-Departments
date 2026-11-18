import React from 'react';
import { AuditConfig, AuditColumnConfig } from '../../../types/index';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';

interface AuditSectionProps {
  auditConfig?: AuditConfig;
  setAuditConfig: (config: AuditConfig | undefined) => void;
  fieldOptions: { label: string; value: string }[];
}

export const AuditSection: React.FC<AuditSectionProps> = ({
  auditConfig,
  setAuditConfig,
  fieldOptions,
}) => {
  const addColumn = () => {
    const newCol: AuditColumnConfig = {
      id: crypto.randomUUID(),
      field: '',
      label: '',
      nonCompliantValues: [],
    };
    const currentCols = auditConfig?.columns || [];
    setAuditConfig({ columns: [...currentCols, newCol] });
  };

  const updateColumn = (index: number, key: keyof AuditColumnConfig, value: any) => {
    const currentCols = [...(auditConfig?.columns || [])];
    currentCols[index] = { ...currentCols[index], [key]: value };
    setAuditConfig({ columns: currentCols });
  };

  const removeColumn = (index: number) => {
    const currentCols = [...(auditConfig?.columns || [])];
    currentCols.splice(index, 1);
    setAuditConfig(currentCols.length > 0 ? { columns: currentCols } : undefined);
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-[var(--color-border-default)] mt-6">
      <h5 className="text-sm font-semibold text-[var(--color-content-primary)] mb-1">Ângulo de Auditoria</h5>
      <p className="text-xs text-[var(--color-content-secondary)] mb-4">
        Selecione as colunas (ex: até 12 colunas) que compõem o quadro de auditoria. Para cada coluna, indique os valores que representam "Não conforme" (separados por vírgula).
      </p>

      <div className="space-y-4">
        {(auditConfig?.columns || []).map((col, idx) => (
          <div key={col.id} className="flex flex-col md:flex-row items-end gap-4 p-4 border border-[var(--color-border-default)] rounded bg-[var(--color-background-light)]">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campo Origem</label>
              <Select 
                value={col.field} 
                onChange={(e) => updateColumn(idx, 'field', e.target.value)} 
                options={fieldOptions} 
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Nome de Exibição (Label)</label>
              <input
                type="text"
                className="w-full text-sm p-3 border border-[var(--color-border-default)] rounded-lg bg-white outline-none focus:border-[var(--color-brand-main)]"
                value={col.label}
                onChange={(e) => updateColumn(idx, 'label', e.target.value)}
                placeholder="Ex: Documentação CNH"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Valores Não Conformes (separados por vírgula)</label>
              <input
                type="text"
                className="w-full text-sm p-3 border border-[var(--color-border-default)] rounded-lg bg-white outline-none focus:border-[var(--color-brand-main)]"
                value={col.nonCompliantValues.join(', ')}
                onChange={(e) => updateColumn(idx, 'nonCompliantValues', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="Ex: Não conforme, Faltante, Reprovado"
              />
            </div>
            <div className="pb-1">
              <Button variant="danger" className="p-2 h-auto text-xs" onClick={() => removeColumn(idx)}>
                Remover
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="secondary" className="mt-4" onClick={addColumn}>
        + Adicionar Coluna de Auditoria
      </Button>
    </div>
  );
};
