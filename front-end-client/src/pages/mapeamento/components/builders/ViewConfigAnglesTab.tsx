import React from 'react';
import { AnglesSection } from '../AnglesSection';
import { AuditSection } from '../AuditSection';
import { CollapsibleCard } from '../../../../components/ui/CollapsibleCard';

interface ViewConfigAnglesTabProps {
  pageType: 'PROCESSO' | 'CADASTRO' | 'INTEGRACAO';
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
  auditConfig: any;
  setAuditConfig: (val: any) => void;
  fieldOptions: { value: string; label: string }[];
}

export const ViewConfigAnglesTab: React.FC<ViewConfigAnglesTabProps> = ({
  pageType,
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
  auditConfig,
  setAuditConfig,
  fieldOptions
}) => {
  if (pageType === 'CADASTRO') return null;

  return (
    <CollapsibleCard title="Ângulos" defaultOpen={false} compact={true} className="bg-[var(--color-background-light)]">
      <AnglesSection
        mappedKanbanColumn={mappedKanbanColumn}
        setMappedKanbanColumn={setMappedKanbanColumn}
        mappedCalendarDateField={mappedCalendarDateField}
        setMappedCalendarDateField={setMappedCalendarDateField}
        mappedPriorityQuadrantField={mappedPriorityQuadrantField || ''}
        setMappedPriorityQuadrantField={setMappedPriorityQuadrantField as any}
        mappedPriorityDescriptionField={mappedPriorityDescriptionField || ''}
        setMappedPriorityDescriptionField={setMappedPriorityDescriptionField as any}
        mappedSlaStartDateField={mappedSlaStartDateField || ''}
        setMappedSlaStartDateField={setMappedSlaStartDateField as any}
        mappedSlaDurationDays={mappedSlaDurationDays || 0}
        setMappedSlaDurationDays={setMappedSlaDurationDays as any}
        fieldOptions={fieldOptions}
      />
      <AuditSection 
        auditConfig={auditConfig}
        setAuditConfig={setAuditConfig}
        fieldOptions={fieldOptions}
      />
    </CollapsibleCard>
  );
};
