import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Plus, Trash2 } from 'lucide-react';
import { SecondaryFieldConfig } from '../../../types/index';
import { RelationalConfigSection } from './RelationalConfigSection';
import { CollapsibleCard } from '../../../components/ui/CollapsibleCard';

interface SecondaryFieldsSectionProps {
  pageType?: 'PROCESSO' | 'CADASTRO';
  mappedSecondaryReadOnly: SecondaryFieldConfig[];
  mappedSecondaryEditable: SecondaryFieldConfig[];
  fieldOptions: { label: string, value: string }[];
  observationFields?: SecondaryFieldConfig[];
  addSecondaryField: (type: 'readonly' | 'editable') => void;
  updateSecondaryField: (type: 'readonly' | 'editable', index: number, key: keyof SecondaryFieldConfig, value: any) => void;
  removeSecondaryField: (type: 'readonly' | 'editable', index: number) => void;
}

export const SecondaryFieldsSection: React.FC<SecondaryFieldsSectionProps> = ({
  pageType = 'PROCESSO',
  mappedSecondaryReadOnly,
  mappedSecondaryEditable,
  fieldOptions,
  observationFields = [],
  addSecondaryField,
  updateSecondaryField,
  removeSecondaryField,
}) => {
  const getConditionalOptions = (currentItemField: string) => [
    { label: 'Sempre exibir (Sem condição)', value: '' },
    ...(mappedSecondaryEditable.filter(f => f.field && f.field !== currentItemField).map(f => ({
      label: `[Relacional Edição] ${f.label || f.field}`,
      value: f.field
    }))),
    ...(mappedSecondaryReadOnly.filter(f => f.field && f.field !== currentItemField).map(f => ({
      label: `[Relacional Leitura] ${f.label || f.field}`,
      value: f.field
    }))),
    ...((observationFields || []).filter(f => f.field && f.field !== currentItemField).map(f => ({
      label: `[Formulário Obs] ${f.label || f.field}`,
      value: f.field
    }))),
    ...fieldOptions.map(opt => ({
      label: `[Principal / Processo] ${opt.label || opt.value}`,
      value: opt.value
    }))
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 bg-[var(--color-background-light)] border border-[var(--color-border-default)] rounded-lg"><h4 className="text-sm font-bold text-[var(--color-content-primary)] mb-4">Dados Secundários</h4><div className="space-y-6"><div><div className="flex justify-between items-center mb-4"><h5 className="text-sm font-semibold text-[var(--color-content-secondary)]">Leitura</h5>
        <Button variant="secondary" onClick={() => addSecondaryField('readonly')}><Plus size={14} className="mr-1" /> Adicionar Campo</Button></div>
        <div className="space-y-3">
          {mappedSecondaryReadOnly.length === 0 && (
            <p className="text-xs text-[var(--color-content-tertiary)] italic">Nenhum campo configurado.</p>
          )}
          {mappedSecondaryReadOnly.map((item, idx) => (
            <div key={item.id} className="flex flex-col space-y-3 p-3 bg-white rounded-lg border border-[var(--color-border-default)]">
              <div className="flex space-x-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Coluna Original Firestore</label>
                  <Select value={item.field} onChange={(e) => updateSecondaryField('readonly', idx, 'field', e.target.value)} options={fieldOptions} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Tipo de Dado</label>
                  <Select 
                    value={item.type || 'text'} 
                    onChange={(e) => updateSecondaryField('readonly', idx, 'type', e.target.value)} 
                    options={[
                      { label: 'Texto Curto', value: 'text' },
                      { label: 'Número', value: 'number' },
                      { label: 'Data', value: 'date' },
                      { label: 'Booleano', value: 'boolean' },
                      { label: 'Seleção (Lista)', value: 'select' },
                      { label: 'Link (URL)', value: 'link' }
                    ]} 
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Rótulo (Para o Usuário)</label>
                  <Input value={item.label} onChange={(e) => updateSecondaryField('readonly', idx, 'label', e.target.value)} placeholder="Ex: Rótulo Amigável" />
                </div>
                <button onClick={() => removeSecondaryField('readonly', idx)} className="h-10 px-3 text-[var(--color-content-tertiary)] hover:text-[var(--color-status-error)] transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
              
              {item.type === 'select' && !item.isRelational && (
                 <div className="flex-1 mt-2">
                   <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Opções (separadas por vírgula)</label>
                   <Input value={item.optionsList || ''} onChange={(e) => updateSecondaryField('readonly', idx, 'optionsList', e.target.value)} placeholder="Ex: Pendente, Concluída, Em Revisão" />
                 </div>
              )}

              {pageType === 'CADASTRO' && (
                <div className="flex-1">
                  <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Aba / Seção do Menu Lateral</label>
                  <Input value={item.section || ''} onChange={(e) => updateSecondaryField('readonly', idx, 'section', e.target.value)} placeholder="Ex: Informação Acadêmica" />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 pt-2 border-t border-[var(--color-border-default)]">
                <div>
                  <label className="block text-xs text-[var(--color-content-secondary)] mb-1 font-semibold">Exibir apenas se (Campo Acionador)</label>
                  <Select
                    value={item.conditionalField || ''}
                    onChange={(e: any) => updateSecondaryField('readonly', idx, 'conditionalField', e.target.value)}
                    options={getConditionalOptions(item.field || '')}
                  />
                </div>
                {item.conditionalField && (
                  <div>
                    <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Valor Esperado no Acionador</label>
                    <Input
                      value={item.conditionalValue || ''}
                      onChange={(e: any) => updateSecondaryField('readonly', idx, 'conditionalValue', e.target.value)}
                      placeholder="Ex: Pendente, Sim, Aprovado"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div></div><div className="border-t border-[var(--color-border-default)] pt-6"><div className="flex justify-between items-center mb-4"><h5 className="text-sm font-semibold text-[var(--color-content-secondary)]">Editável</h5>
        <Button variant="secondary" onClick={() => addSecondaryField('editable')}><Plus size={14} className="mr-1" /> Adicionar Campo</Button></div>
        <div className="space-y-3">
          {mappedSecondaryEditable.length === 0 && (
            <p className="text-xs text-[var(--color-content-tertiary)] italic">Nenhum campo configurado.</p>
          )}
          {mappedSecondaryEditable.map((item, idx) => (
            <div key={item.id} className="flex flex-col space-y-3 p-3 bg-white rounded-lg border border-[var(--color-border-default)]">
              <div className="flex space-x-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Coluna Original Firestore</label>
                  <Select value={item.field} onChange={(e) => updateSecondaryField('editable', idx, 'field', e.target.value)} options={fieldOptions} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Tipo de Dado</label>
                  <Select 
                    value={item.type || 'text'} 
                    onChange={(e) => updateSecondaryField('editable', idx, 'type', e.target.value)} 
                    options={[
                      { label: 'Texto Curto', value: 'text' },
                      { label: 'Número', value: 'number' },
                      { label: 'Data', value: 'date' },
                      { label: 'Booleano', value: 'boolean' },
                      { label: 'Seleção (Lista)', value: 'select' },
                      { label: 'Link (URL)', value: 'link' }
                    ]} 
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Rótulo (Para o Usuário)</label>
                  <Input value={item.label} onChange={(e) => updateSecondaryField('editable', idx, 'label', e.target.value)} placeholder="Ex: Data Prevista" />
                </div>
                <button onClick={() => removeSecondaryField('editable', idx)} className="h-10 px-3 text-[var(--color-content-tertiary)] hover:text-[var(--color-status-error)] transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
              
              {item.type === 'select' && !item.isRelational && (
                 <div className="flex-1 mt-2">
                   <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Opções (separadas por vírgula)</label>
                   <Input value={item.optionsList || ''} onChange={(e) => updateSecondaryField('editable', idx, 'optionsList', e.target.value)} placeholder="Ex: Pendente, Concluída, Em Revisão" />
                 </div>
              )}

              {pageType === 'CADASTRO' && (
                <div className="flex-1">
                  <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Aba / Seção do Menu Lateral</label>
                  <Input value={item.section || ''} onChange={(e) => updateSecondaryField('editable', idx, 'section', e.target.value)} placeholder="Ex: Informação Acadêmica" />
                </div>
              )}
              
              <RelationalConfigSection 
                item={item} 
                onChange={(key, value) => updateSecondaryField('editable', idx, key as any, value)} 
                label="É relacional?" 
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 pt-2 border-t border-[var(--color-border-default)]">
                <div>
                  <label className="block text-xs text-[var(--color-content-secondary)] mb-1 font-semibold">Validação / Formato Obrigatório</label>
                  <Select
                    value={item.validationType || 'none'}
                    onChange={(e: any) => updateSecondaryField('editable', idx, 'validationType', e.target.value)}
                    options={[
                      { label: 'Livre (Sem validação)', value: 'none' },
                      { label: 'E-mail', value: 'email' },
                      { label: 'Telefone / WhatsApp', value: 'phone' },
                      { label: 'Nº Processo (000000/0000)', value: 'process_number' },
                      { label: 'CPF / CNPJ', value: 'cpf_cnpj' },
                      { label: 'Expressão Regular (Regex)', value: 'custom_regex' }
                    ]}
                  />
                </div>
                {item.validationType === 'custom_regex' ? (
                  <div>
                    <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Padrão Regex / Mensagem de Erro</label>
                    <div className="flex gap-1">
                      <Input value={item.validationRegex || ''} onChange={(e: any) => updateSecondaryField('editable', idx, 'validationRegex', e.target.value)} placeholder="Ex: ^\d{4}$" className="flex-1" />
                      <Input value={item.validationMessage || ''} onChange={(e: any) => updateSecondaryField('editable', idx, 'validationMessage', e.target.value)} placeholder="Alerta" className="flex-1" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Ajuda visual ao usuário</label>
                    <p className="text-[11px] text-[var(--color-content-tertiary)] mt-1">
                      {item.validationType === 'email' && 'Validará formato de e-mail.'}
                      {item.validationType === 'phone' && 'Exigirá DDD e número de telefone.'}
                      {item.validationType === 'process_number' && 'Formatação automática em 000000/0000.'}
                      {item.validationType === 'cpf_cnpj' && 'Validará 11 (CPF) ou 14 (CNPJ) dígitos.'}
                      {(!item.validationType || item.validationType === 'none') && 'O usuário poderá digitar livremente.'}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 pt-2 border-t border-[var(--color-border-default)]">
                <div>
                  <label className="block text-xs text-[var(--color-content-secondary)] mb-1 font-semibold">Exibir apenas se (Campo Acionador)</label>
                  <Select
                    value={item.conditionalField || ''}
                    onChange={(e: any) => updateSecondaryField('editable', idx, 'conditionalField', e.target.value)}
                    options={getConditionalOptions(item.field || '')}
                  />
                </div>
                {item.conditionalField && (
                  <div>
                    <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Valor Esperado no Acionador</label>
                    <Input
                      value={item.conditionalValue || ''}
                      onChange={(e: any) => updateSecondaryField('editable', idx, 'conditionalValue', e.target.value)}
                      placeholder="Ex: Pendente, Sim, Aprovado"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
            </div>
          </div>
        </div>
      </div>

          </div>
  );
}
