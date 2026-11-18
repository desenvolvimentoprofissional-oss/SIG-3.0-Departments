import React from 'react';
import { SecondaryFieldConfig } from '../../../../types/index';
import { DispatchSystemSection } from '../DispatchSystemSection';
import { CollapsibleCard } from '../../../../components/ui/CollapsibleCard';

interface ViewConfigFormsTabProps {
  pageType: 'PROCESSO' | 'CADASTRO' | 'INTEGRACAO';
  enableDispatchSystem: boolean;
  setEnableDispatchSystem: (val: boolean) => void;
  dispatchToOptions: string;
  setDispatchToOptions: (val: string) => void;
  dispatchStatus: string;
  setDispatchStatus: (val: string) => void;
  dispatchRelationalKey: string;
  setDispatchRelationalKey: (val: string) => void;
  fieldOptions: { value: string; label: string }[];
  secondaryFieldsReadOnly: SecondaryFieldConfig[];
  secondaryFieldsEditable: SecondaryFieldConfig[];
  returnStatus: string;
  setReturnStatus: (val: string) => void;
  enableObservations: boolean;
  setEnableObservations: (val: boolean) => void;
  observationRelationalKey: string;
  setObservationRelationalKey: (val: string) => void;
  observationGoogleSheetUrl: string;
  setObservationGoogleSheetUrl: (val: string) => void;
  observationGoogleSheetTab: string;
  setObservationGoogleSheetTab: (val: string) => void;
  observationSheetColumnIdRelacional: string;
  setObservationSheetColumnIdRelacional: (val: string) => void;
  observationSheetColumnDate: string;
  setObservationSheetColumnDate: (val: string) => void;
  observationSheetColumnObservation: string;
  setObservationSheetColumnObservation: (val: string) => void;
  observationSheetColumnStatus: string;
  setObservationSheetColumnStatus: (val: string) => void;
  observationSheetColumnStatusText: string;
  setObservationSheetColumnStatusText: (val: string) => void;
  observationSheetColumnDetails: string;
  setObservationSheetColumnDetails: (val: string) => void;
  observationSheetColumnDetailsText: string;
  setObservationSheetColumnDetailsText: (val: string) => void;
  observationFields: SecondaryFieldConfig[];
  setObservationFields: (val: SecondaryFieldConfig[]) => void;
  enableVoting: boolean;
  setEnableVoting: (val: boolean) => void;
  votingOptions: string;
  setVotingOptions: (val: string) => void;
}

export const ViewConfigFormsTab: React.FC<ViewConfigFormsTabProps> = ({
  pageType,
  enableDispatchSystem,
  setEnableDispatchSystem,
  dispatchToOptions,
  setDispatchToOptions,
  dispatchStatus,
  setDispatchStatus,
  dispatchRelationalKey,
  setDispatchRelationalKey,
  fieldOptions,
  secondaryFieldsReadOnly,
  secondaryFieldsEditable,
  returnStatus,
  setReturnStatus,
  enableObservations,
  setEnableObservations,
  observationRelationalKey,
  setObservationRelationalKey,
  observationGoogleSheetUrl,
  setObservationGoogleSheetUrl,
  observationGoogleSheetTab,
  setObservationGoogleSheetTab,
  observationSheetColumnIdRelacional,
  setObservationSheetColumnIdRelacional,
  observationSheetColumnDate,
  setObservationSheetColumnDate,
  observationSheetColumnObservation,
  setObservationSheetColumnObservation,
  observationSheetColumnStatus,
  setObservationSheetColumnStatus,
  observationSheetColumnStatusText,
  setObservationSheetColumnStatusText,
  observationSheetColumnDetails,
  setObservationSheetColumnDetails,
  observationSheetColumnDetailsText,
  setObservationSheetColumnDetailsText,
  observationFields,
  setObservationFields,
  enableVoting,
  setEnableVoting,
  votingOptions,
  setVotingOptions
}) => {
  if (pageType === 'CADASTRO') return null;

  return (
    <CollapsibleCard title="Formulários" defaultOpen={false} compact={true} className="bg-[var(--color-background-light)]">
      <DispatchSystemSection
        enableDispatchSystem={enableDispatchSystem}
        setEnableDispatchSystem={setEnableDispatchSystem}
        dispatchToOptions={dispatchToOptions}
        setDispatchToOptions={setDispatchToOptions}
        dispatchStatus={dispatchStatus}
        setDispatchStatus={setDispatchStatus}
        dispatchRelationalKey={dispatchRelationalKey}
        setDispatchRelationalKey={setDispatchRelationalKey}
        fieldOptions={fieldOptions}
        secondaryFieldsReadOnly={secondaryFieldsReadOnly}
        secondaryFieldsEditable={secondaryFieldsEditable}
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
    </CollapsibleCard>
  );
};
