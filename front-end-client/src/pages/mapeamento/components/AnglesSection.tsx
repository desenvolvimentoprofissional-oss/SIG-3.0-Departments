import React from 'react';
import { Select } from '../../../components/ui/Select';
import { CollapsibleCard } from '../../../components/ui/CollapsibleCard';

interface AnglesSectionProps {
  mappedKanbanColumn: string;
  setMappedKanbanColumn: (val: string) => void;
  mappedCalendarDateField: string;
  setMappedCalendarDateField: (val: string) => void;
  mappedPriorityQuadrantField: string;
  setMappedPriorityQuadrantField: (val: string) => void;
  mappedPriorityDescriptionField: string;
  setMappedPriorityDescriptionField: (val: string) => void;
  mappedSlaStartDateField: string;
  setMappedSlaStartDateField: (val: string) => void;
  mappedSlaDurationDays: number;
  setMappedSlaDurationDays: (val: number) => void;
  fieldOptions: { label: string; value: string }[];
}

export const AnglesSection: React.FC<AnglesSectionProps> = ({
  mappedKanbanColumn,
  setMappedKanbanColumn,
  mappedCalendarDateField,
  setMappedCalendarDateField,
  mappedPriorityQuadrantField,
  setMappedPriorityQuadrantField,
  mappedPriorityDescriptionField,
  setMappedPriorityDescriptionField,
  mappedSlaStartDateField,
  setMappedSlaStartDateField,
  mappedSlaDurationDays,
  setMappedSlaDurationDays,
  fieldOptions,
}) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-lg border border-[var(--color-border-default)]">
        <h5 className="text-sm font-semibold text-[var(--color-content-primary)] mb-1">Agrupamento Kanban</h5>
        <p className="text-xs text-[var(--color-content-secondary)] mb-4">Selecione qual campo original definirá o cabeçalho (as colunas) na visualização KANBAN.</p>
        <div className="md:w-1/2">
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campo Agrupador (ex: status, fase, step)</label>
          <Select value={mappedKanbanColumn} onChange={(e) => setMappedKanbanColumn(e.target.value)} options={fieldOptions} />
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg border border-[var(--color-border-default)]">
        <h5 className="text-sm font-semibold text-[var(--color-content-primary)] mb-1">Ordenação por Calendário</h5>
        <p className="text-xs text-[var(--color-content-secondary)] mb-4">Selecione qual campo (data) será utilizado para posicionar os itens no CALENDÁRIO.</p>
        <div className="md:w-1/2">
          <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campo de Data (ex: dataPrevisao, dataAgendamento)</label>
          <Select value={mappedCalendarDateField} onChange={(e) => setMappedCalendarDateField(e.target.value)} options={fieldOptions} />
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg border border-[var(--color-border-default)]">
        <h5 className="text-sm font-semibold text-[var(--color-content-primary)] mb-1">Matriz de Prioridade</h5>
        <p className="text-xs text-[var(--color-content-secondary)] mb-4">Selecione o campo de classificação de prioridade ('Máxima, Alta, Média, Baixa') e o campo descritivo para a matriz.</p>
        <div className="flex md:flex-row flex-col gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campo de Classificação</label>
            <Select value={mappedPriorityQuadrantField || ''} onChange={(e) => setMappedPriorityQuadrantField(e.target.value)} options={fieldOptions} />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campo de Detalhes / Descrição</label>
            <Select value={mappedPriorityDescriptionField || ''} onChange={(e) => setMappedPriorityDescriptionField(e.target.value)} options={fieldOptions} />
          </div>
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg border border-[var(--color-border-default)]">
        <h5 className="text-sm font-semibold text-[var(--color-content-primary)] mb-1">SLA / Prazo</h5>
        <p className="text-xs text-[var(--color-content-secondary)] mb-4">Configure o SLA de Atendimento para o modo de visualização SLA e Gantt.</p>
        <div className="flex md:flex-row flex-col gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Campo Data de Início do SLA</label>
            <Select value={mappedSlaStartDateField || ''} onChange={(e) => setMappedSlaStartDateField(e.target.value)} options={fieldOptions} />
          </div>
          <div className="w-[200px]">
              <label className="block text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-2">Duração Total (Dias)</label>
              <input 
                  type="number" 
                  min="1"
                className="w-full text-sm p-3 border border-[var(--color-border-default)] rounded-lg bg-white text-[var(--color-content-primary)] focus:border-[var(--color-brand-main)] outline-none transition-colors"
                value={mappedSlaDurationDays || ''}
                onChange={(e) => setMappedSlaDurationDays(parseInt(e.target.value) || 0)}
              />
          </div>
        </div>
      </div>
    </div>
  );
};
