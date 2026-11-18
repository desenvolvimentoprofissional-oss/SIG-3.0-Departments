import React from 'react';
import { CustomActionConfig } from '../../../types/mapping.base.types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Plus, Trash2 } from 'lucide-react';

interface CustomActionsSectionProps {
  customActions: CustomActionConfig[];
  setCustomActions: React.Dispatch<React.SetStateAction<CustomActionConfig[]>>;
}

export const CustomActionsSection: React.FC<CustomActionsSectionProps> = ({
  customActions,
  setCustomActions
}) => {
  const addAction = () => {
    setCustomActions([
      ...customActions,
      { id: crypto.randomUUID(), label: '', scriptUrl: '' }
    ]);
  };

  const updateAction = (index: number, key: keyof CustomActionConfig, value: string) => {
    const arr = [...customActions];
    arr[index] = { ...arr[index], [key]: value };
    setCustomActions(arr);
  };

  const removeAction = (index: number) => {
    const arr = [...customActions];
    arr.splice(index, 1);
    setCustomActions(arr);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Ações Customizadas (Google Apps Script)</h4>
        <Button className="h-8" variant="secondary" onClick={addAction}>
          <Plus className="w-4 h-4 mr-2" /> Adicionar Botão
        </Button>
      </div>
      
      {customActions.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">Nenhum botão customizado configurado.</p>
      ) : (
        <div className="space-y-3">
          {customActions.map((action, index) => (
            <div key={action.id} className="flex items-center gap-3 p-3 border border-[var(--color-border-default)] rounded-md bg-white">
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-content-secondary)] mb-1">Nome do Botão</label>
                  <Input
                    value={action.label}
                    onChange={(e) => updateAction(index, 'label', e.target.value)}
                    placeholder="Ex: Disparar Script"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-content-secondary)] mb-1">Nome da Função/Script Alvo (Opcional)</label>
                  <Input
                    value={action.functionName || ''}
                    onChange={(e) => updateAction(index, 'functionName', e.target.value)}
                    placeholder="Ex: registrarAcesso"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-content-secondary)] mb-1">URL do Webhook (Google Apps Script)</label>
                  <Input
                    value={action.scriptUrl}
                    onChange={(e) => updateAction(index, 'scriptUrl', e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                  />
                </div>
              </div>
              <Button className="h-8 w-8 !p-0" variant="danger" onClick={() => removeAction(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

