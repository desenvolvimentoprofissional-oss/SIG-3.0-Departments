import React from 'react';
import { SecondaryFieldConfig } from '../../../../types/index';
import { PrimaryFieldsSection } from '../PrimaryFieldsSection';
import { SecondaryFieldsSection } from '../SecondaryFieldsSection';
import { CollapsibleCard } from '../../../../components/ui/CollapsibleCard';

interface ViewConfigMappingTabProps {
  pageType: 'PROCESSO' | 'CADASTRO' | 'INTEGRACAO';
  mappedPrimary: any;
  setMappedPrimary: (val: any) => void;
  mappedSecondaryReadOnly: SecondaryFieldConfig[];
  mappedSecondaryEditable: SecondaryFieldConfig[];
  extractedFields: string[];
  fieldOptions: { value: string; label: string }[];
  observationFields: SecondaryFieldConfig[];
  addSecondaryField: (type: 'readonly' | 'editable') => void;
  updateSecondaryField: (type: 'readonly' | 'editable', index: number, key: keyof SecondaryFieldConfig, value: any) => void;
  removeSecondaryField: (type: 'readonly' | 'editable', index: number) => void;
}

export const ViewConfigMappingTab: React.FC<ViewConfigMappingTabProps> = ({
  pageType,
  mappedPrimary,
  setMappedPrimary,
  mappedSecondaryReadOnly,
  mappedSecondaryEditable,
  extractedFields,
  fieldOptions,
  observationFields,
  addSecondaryField,
  updateSecondaryField,
  removeSecondaryField
}) => {
  return (
    <CollapsibleCard title="Mapeamento" defaultOpen={false} compact={true} className="bg-[var(--color-background-light)]">
      {pageType !== 'CADASTRO' && (
        <PrimaryFieldsSection 
          pageType={pageType as 'PROCESSO'}
          mappedPrimary={mappedPrimary} 
          setMappedPrimary={setMappedPrimary} 
          availableFields={extractedFields} 
          fieldOptions={fieldOptions} 
        />
      )}
      <SecondaryFieldsSection 
        pageType={pageType as 'PROCESSO' | 'CADASTRO'}
        mappedSecondaryReadOnly={mappedSecondaryReadOnly}
        mappedSecondaryEditable={mappedSecondaryEditable}
        fieldOptions={fieldOptions}
        observationFields={observationFields}
        addSecondaryField={addSecondaryField}
        updateSecondaryField={updateSecondaryField}
        removeSecondaryField={removeSecondaryField}
      />
    </CollapsibleCard>
  );
};
