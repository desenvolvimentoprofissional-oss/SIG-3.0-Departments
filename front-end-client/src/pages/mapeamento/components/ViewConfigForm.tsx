import React from 'react';
import { ViewMappingConfig } from '../../../types/index';
import { ViewConfigMappingTab } from './builders/ViewConfigMappingTab';
import { ViewConfigAnglesTab } from './builders/ViewConfigAnglesTab';
import { ViewConfigSearchTab } from './builders/ViewConfigSearchTab';
import { ViewConfigFormsTab } from './builders/ViewConfigFormsTab';
import { ViewConfigActionsTab } from './builders/ViewConfigActionsTab';
import { useViewConfigFormState } from './builders/useViewConfigFormState';

interface ViewConfigFormProps {
  pageType: 'PROCESSO' | 'CADASTRO' | 'INTEGRACAO';
  extractedFields: string[];
  customFieldOptions?: { value: string; label: string }[];
  initialConfig?: ViewMappingConfig | null;
  onSave: (config: ViewMappingConfig) => void;
  onCancel: () => void;
}

export const ViewConfigForm: React.FC<ViewConfigFormProps> = ({
  pageType,
  extractedFields,
  customFieldOptions,
  initialConfig,
  onSave,
  onCancel
}) => {
  const {
    universalFilters, setUniversalFilters,
    mappedPrimary, setMappedPrimary,
    mappedSecondaryReadOnly, setMappedSecondaryReadOnly,
    mappedSecondaryEditable, setMappedSecondaryEditable,
    mappedKanbanColumn, setMappedKanbanColumn,
    mappedCalendarDateField, setMappedCalendarDateField,
    mappedPriorityQuadrantField, setMappedPriorityQuadrantField,
    mappedPriorityDescriptionField, setMappedPriorityDescriptionField,
    mappedSlaStartDateField, setMappedSlaStartDateField,
    mappedSlaDurationDays, setMappedSlaDurationDays,
    searchFields, setSearchFields,
    filterFields, setFilterFields,
    filterLabels, setFilterLabels,
    groupingFields, setGroupingFields,
    enableDispatchSystem, setEnableDispatchSystem,
    dispatchToOptions, setDispatchToOptions,
    dispatchStatus, setDispatchStatus,
    dispatchRelationalKey, setDispatchRelationalKey,
    returnStatus, setReturnStatus,
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
    enableVoting, setEnableVoting,
    votingOptions, setVotingOptions,
    auditConfig, setAuditConfig,
    customActions, setCustomActions,
    fieldOptions: defaultFieldOptions,
    addSecondaryField,
    updateSecondaryField,
    removeSecondaryField
  } = useViewConfigFormState({ extractedFields, initialConfig, onSave });

  const fieldOptions = customFieldOptions || defaultFieldOptions;

  if (pageType === 'INTEGRACAO') {
     return <p className="text-sm">Configuração de views não se aplica a Integração (iFrame).</p>;
  }

  return (
    <div className="space-y-4">
      <ViewConfigMappingTab
        pageType={pageType}
        mappedPrimary={mappedPrimary}
        setMappedPrimary={setMappedPrimary}
        mappedSecondaryReadOnly={mappedSecondaryReadOnly}
        mappedSecondaryEditable={mappedSecondaryEditable}
        extractedFields={extractedFields}
        fieldOptions={fieldOptions}
        observationFields={observationFields}
        addSecondaryField={addSecondaryField}
        updateSecondaryField={updateSecondaryField}
        removeSecondaryField={removeSecondaryField}
      />
      <ViewConfigAnglesTab
        pageType={pageType}
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
        auditConfig={auditConfig}
        setAuditConfig={setAuditConfig}
        fieldOptions={fieldOptions}
      />
      <ViewConfigSearchTab
        extractedFields={extractedFields}
        fieldOptions={fieldOptions}
        searchFields={searchFields}
        setSearchFields={setSearchFields}
        filterFields={filterFields}
        setFilterFields={setFilterFields}
        filterLabels={filterLabels}
        setFilterLabels={setFilterLabels}
        groupingFields={groupingFields}
        setGroupingFields={setGroupingFields}
        universalFilters={universalFilters}
        setUniversalFilters={setUniversalFilters}
      />
      <ViewConfigFormsTab
        pageType={pageType}
        enableDispatchSystem={enableDispatchSystem}
        setEnableDispatchSystem={setEnableDispatchSystem}
        dispatchToOptions={dispatchToOptions}
        setDispatchToOptions={setDispatchToOptions}
        dispatchStatus={dispatchStatus}
        setDispatchStatus={setDispatchStatus}
        dispatchRelationalKey={dispatchRelationalKey}
        setDispatchRelationalKey={setDispatchRelationalKey}
        fieldOptions={fieldOptions}
        secondaryFieldsReadOnly={mappedSecondaryReadOnly}
        secondaryFieldsEditable={mappedSecondaryEditable}
        returnStatus={returnStatus}
        setReturnStatus={setReturnStatus}
        enableObservations={enableObservations}
        setEnableObservations={setEnableObservations}
        observationRelationalKey={observationRelationalKey}
        setObservationRelationalKey={setObservationRelationalKey}
        observationGoogleSheetUrl={observationGoogleSheetUrl}
        setObservationGoogleSheetUrl={setObservationGoogleSheetUrl}
        observationGoogleSheetTab={observationGoogleSheetTab}
        setObservationGoogleSheetTab={setObservationGoogleSheetTab}
        observationSheetColumnIdRelacional={observationSheetColumnIdRelacional}
        setObservationSheetColumnIdRelacional={setObservationSheetColumnIdRelacional}
        observationSheetColumnDate={observationSheetColumnDate}
        setObservationSheetColumnDate={setObservationSheetColumnDate}
        observationSheetColumnObservation={observationSheetColumnObservation}
        setObservationSheetColumnObservation={setObservationSheetColumnObservation}
        observationSheetColumnStatus={observationSheetColumnStatus}
        setObservationSheetColumnStatus={setObservationSheetColumnStatus}
        observationSheetColumnStatusText={observationSheetColumnStatusText}
        setObservationSheetColumnStatusText={setObservationSheetColumnStatusText}
        observationSheetColumnDetails={observationSheetColumnDetails}
        setObservationSheetColumnDetails={setObservationSheetColumnDetails}
        observationSheetColumnDetailsText={observationSheetColumnDetailsText}
        setObservationSheetColumnDetailsText={setObservationSheetColumnDetailsText}
        observationFields={observationFields}
        setObservationFields={setObservationFields}
        enableVoting={enableVoting}
        setEnableVoting={setEnableVoting}
        votingOptions={votingOptions}
        setVotingOptions={setVotingOptions}
      />
      <ViewConfigActionsTab
        pageType={pageType}
        customActions={customActions}
        setCustomActions={setCustomActions}
      />
    </div>
  );
};
