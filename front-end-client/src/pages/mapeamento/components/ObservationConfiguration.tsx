import React from 'react';
import { Toggle } from '../../../components/ui/Toggle';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { CollapsibleCard } from '../../../components/ui/CollapsibleCard';
import { Plus, Trash2 } from 'lucide-react';
import { SecondaryFieldConfig } from '../../../types/index';

export const ObservationConfiguration = ({
  enableObservations, setEnableObservations,
  observationRelationalKey, setObservationRelationalKey,
  observationGoogleSheetUrl, setObservationGoogleSheetUrl,
  observationGoogleSheetTab, setObservationGoogleSheetTab,
  observationSheetColumnIdRelacional, setObservationSheetColumnIdRelacional,
  observationSheetColumnDate, setObservationSheetColumnDate,
  observationSheetColumnObservation, setObservationSheetColumnObservation,
  observationSheetColumnStatus, setObservationSheetColumnStatus,
  observationSheetColumnStatusText, setObservationSheetColumnStatusText,
  observationSheetColumnDetails, setObservationSheetColumnDetails,
  observationSheetColumnDetailsText, setObservationSheetColumnDetailsText,
  observationFields, setObservationFields,
  secondaryFieldsReadOnly, secondaryFieldsEditable,
  fieldOptions,
  addObservationField, updateObservationField, removeObservationField
}: any) => {
  return (
    <CollapsibleCard 
      title="Formulário de Observações" 
      subtitle="Permite a inserção de anotações com histórico de usuário e data/hora diretamente nos detalhes do registro."
      defaultOpen={false}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--color-content-primary)]">Habilitar Observações</span>
        {setEnableObservations && (
          <Toggle checked={!!enableObservations} onChange={setEnableObservations} />
        )}
      </div>
      
      {enableObservations && setObservationFields && (
        <div className="mt-4 pt-4 border-t border-[var(--color-border-default)]">
          <div className="mb-4">
            <label className="block text-xs font-medium text-[var(--color-content-primary)] mb-1">
              Coluna Relacional (Chave Estrangeira do Processo)
            </label>
            <p className="text-xs text-[var(--color-content-tertiary)] mb-2">Selecione o campo que identifica o processo principal. Este ID será salvo junto com cada observação para garantir o vínculo.</p>
            <select
              className="w-full bg-white border border-[var(--color-border-default)] p-3 rounded-lg text-sm focus:border-[var(--color-brand-main)] outline-none"
              value={observationRelationalKey || ''}
              onChange={e => setObservationRelationalKey && setObservationRelationalKey(e.target.value)}
            >
              {fieldOptions?.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-xs font-medium text-[var(--color-content-primary)] mb-1">
              Integração com Google Sheets (URL da Planilha) - Opcional
            </label>
            <p className="text-xs text-[var(--color-content-tertiary)] mb-2">Exemplo: https://docs.google.com/spreadsheets/d/...</p>
            <Input
              placeholder="Insira a URL completa da planilha"
              value={observationGoogleSheetUrl || ''}
              onChange={(e: any) => setObservationGoogleSheetUrl && setObservationGoogleSheetUrl(e.target.value)}
            />
          </div>
          
          {(observationGoogleSheetUrl || '').length > 0 && (
            <>
              <div className="mb-4">
                <label className="block text-xs font-medium text-[var(--color-content-primary)] mb-1">Nome da Guia (Aba) na Planilha</label>
                <Input
                  placeholder="Nome exato da guia"
                  value={observationGoogleSheetTab || ''}
                  onChange={(e: any) => setObservationGoogleSheetTab && setObservationGoogleSheetTab(e.target.value)}
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-content-primary)] mb-1">Coluna para ID Relacional</label>
                  <Input value={observationSheetColumnIdRelacional || ''} onChange={(e: any) => setObservationSheetColumnIdRelacional && setObservationSheetColumnIdRelacional(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-content-primary)] mb-1">Coluna para Data/Horário</label>
                  <Input value={observationSheetColumnDate || ''} onChange={(e: any) => setObservationSheetColumnDate && setObservationSheetColumnDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-content-primary)] mb-1">Coluna para Observação</label>
                  <Input value={observationSheetColumnObservation || ''} onChange={(e: any) => setObservationSheetColumnObservation && setObservationSheetColumnObservation(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-content-primary)] mb-1">Coluna para Status Pendente</label>
                  <Input value={observationSheetColumnStatus || ''} onChange={(e: any) => setObservationSheetColumnStatus && setObservationSheetColumnStatus(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-content-primary)] mb-1">Texto para a Coluna de Status</label>
                  <Input value={observationSheetColumnStatusText || ''} onChange={(e: any) => setObservationSheetColumnStatusText && setObservationSheetColumnStatusText(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-content-primary)] mb-1">Coluna para Detalhes do Status</label>
                  <Input value={observationSheetColumnDetails || ''} onChange={(e: any) => setObservationSheetColumnDetails && setObservationSheetColumnDetails(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-content-primary)] mb-1">Texto para Detalhes do Status</label>
                  <Input value={observationSheetColumnDetailsText || ''} onChange={(e: any) => setObservationSheetColumnDetailsText && setObservationSheetColumnDetailsText(e.target.value)} />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-between items-center mb-4">
            <h5 className="text-sm font-semibold text-[var(--color-content-secondary)]">Novas Colunas do Formulário (Opcional)</h5>
            <Button variant="secondary" onClick={addObservationField}><Plus size={14} className="mr-1" /> Adicionar Campo</Button>
          </div>
          
          <div className="space-y-3">
            {(!observationFields || observationFields.length === 0) && (
              <p className="text-xs text-[var(--color-content-tertiary)] italic">Apenas o campo padrão de texto será exibido.</p>
            )}
            {observationFields?.map((item: any, idx: number) => (
              <div key={item.id} className="flex flex-col space-y-3 p-3 bg-[var(--color-background-light)] rounded-lg border border-[var(--color-border-default)]">
                <div className="flex space-x-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Nome do Campo no Banco</label>
                    <Input value={item.field} onChange={(e: any) => updateObservationField(idx, 'field', e.target.value)} placeholder="Ex: prazo, status" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Tipo de Dado</label>
                    <Select 
                      value={item.type || 'text'} 
                      onChange={(e: any) => updateObservationField(idx, 'type', e.target.value)} 
                      options={[
                        { label: 'Texto Curto', value: 'text' },
                        { label: 'Número', value: 'number' },
                        { label: 'Data', value: 'date' },
                        { label: 'Booleano', value: 'boolean' },
                        { label: 'Seleção (Lista)', value: 'select' }
                      ]} 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Rótulo (Para o Usuário)</label>
                    <Input value={item.label} onChange={(e: any) => updateObservationField(idx, 'label', e.target.value)} placeholder="Ex: Rótulo Amigável" />
                  </div>
                  <button onClick={() => removeObservationField(idx)} className="h-10 px-3 text-[var(--color-content-tertiary)] hover:text-[var(--color-status-error)] transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                {item.type === 'select' && (
                  <div className="flex-1 mt-2">
                    <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Opções (separadas por vírgula)</label>
                    <Input value={item.optionsList || ''} onChange={(e: any) => updateObservationField(idx, 'optionsList', e.target.value)} placeholder="Ex: Pendente, Concluído" />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-[var(--color-border-default)]">
                  <div>
                    <label className="block text-xs text-[var(--color-content-secondary)] mb-1 font-semibold">Validação / Formato Obrigatório</label>
                    <Select
                      value={item.validationType || 'none'}
                      onChange={(e: any) => updateObservationField(idx, 'validationType', e.target.value)}
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
                        <Input value={item.validationRegex || ''} onChange={(e: any) => updateObservationField(idx, 'validationRegex', e.target.value)} placeholder="Ex: ^\d{4}$" className="flex-1" />
                        <Input value={item.validationMessage || ''} onChange={(e: any) => updateObservationField(idx, 'validationMessage', e.target.value)} placeholder="Alerta" className="flex-1" />
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

                <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-[var(--color-border-default)]">
                  <div>
                    <label className="block text-xs text-[var(--color-content-secondary)] mb-1 font-semibold">Exibir apenas se (Campo Acionador)</label>
                    <Select
                      value={item.conditionalField || ''}
                      onChange={(e: any) => updateObservationField(idx, 'conditionalField', e.target.value)}
                      options={[
                        { label: 'Sempre exibir (Sem condição)', value: '' },
                        ...((observationFields || []).filter((f: any) => f.field && f.field !== item.field).map((f: any) => ({
                          label: `[Formulário Obs] ${f.label || f.field}`,
                          value: f.field
                        }))),
                        ...((secondaryFieldsEditable || []).filter((f: any) => f.field && f.field !== item.field).map((f: any) => ({
                          label: `[Relacional Edição] ${f.label || f.field}`,
                          value: f.field
                        }))),
                        ...((secondaryFieldsReadOnly || []).filter((f: any) => f.field && f.field !== item.field).map((f: any) => ({
                          label: `[Relacional Leitura] ${f.label || f.field}`,
                          value: f.field
                        }))),
                        ...(fieldOptions || []).map((opt: any) => ({
                          label: `[Principal / Processo] ${opt.label || opt.value}`,
                          value: opt.value
                        }))
                      ]}
                    />
                  </div>
                  {item.conditionalField && (
                    <div>
                      <label className="block text-xs text-[var(--color-content-secondary)] mb-1">Valor Esperado no Acionador</label>
                      <Input
                        value={item.conditionalValue || ''}
                        onChange={(e: any) => updateObservationField(idx, 'conditionalValue', e.target.value)}
                        placeholder="Ex: Pendente, Sim, Aprovado"
                      />
                    </div>
                  )}
                </div>

                {(observationGoogleSheetUrl || '').length > 0 && (
                  <div className="flex-1 mt-2 border-t border-[var(--color-border-default)] pt-2">
                    <label className="block text-xs text-[var(--color-content-secondary)] mb-1 text-green-700">Coluna na Planilha Google (Opcional)</label>
                    <Input value={item.sheetColumn || ''} onChange={(e: any) => updateObservationField(idx, 'sheetColumn', e.target.value)} placeholder="Ex: F, COLUNA_SETOR" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </CollapsibleCard>
  );
};
