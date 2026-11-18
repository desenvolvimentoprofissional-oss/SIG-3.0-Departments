import React from 'react';
import { DispatchConfiguration } from './DispatchConfiguration';
import { ObservationConfiguration } from './ObservationConfiguration';
import { VotingConfiguration } from './VotingConfiguration';
import { SecondaryFieldConfig } from '../../../types/index';

interface DispatchSystemSectionProps {
  dispatchRelationalKey?: string;
  setDispatchRelationalKey?: (v: string) => void;
  fieldOptions?: { label: string; value: string }[];
  enableDispatchSystem: boolean;
  setEnableDispatchSystem: (v: boolean) => void;
  dispatchToOptions: string;
  setDispatchToOptions: (v: string) => void;
  dispatchStatus: string;
  setDispatchStatus: (v: string) => void;
  returnStatus: string;
  setReturnStatus: (v: string) => void;
  enableObservations?: boolean;
  setEnableObservations?: (v: boolean) => void;
  observationRelationalKey?: string;
  setObservationRelationalKey?: (v: string) => void;
  observationGoogleSheetUrl?: string;
  setObservationGoogleSheetUrl?: (v: string) => void;
  observationGoogleSheetTab?: string;
  setObservationGoogleSheetTab?: (v: string) => void;
  observationSheetColumnIdRelacional?: string;
  setObservationSheetColumnIdRelacional?: (v: string) => void;
  observationSheetColumnDate?: string;
  setObservationSheetColumnDate?: (v: string) => void;
  observationSheetColumnObservation?: string;
  setObservationSheetColumnObservation?: (v: string) => void;
  observationSheetColumnStatus?: string;
  setObservationSheetColumnStatus?: (v: string) => void;
  observationSheetColumnStatusText?: string;
  setObservationSheetColumnStatusText?: (v: string) => void;
  observationSheetColumnDetails?: string;
  setObservationSheetColumnDetails?: (v: string) => void;
  observationSheetColumnDetailsText?: string;
  setObservationSheetColumnDetailsText?: (v: string) => void;
  observationFields?: SecondaryFieldConfig[];
  setObservationFields?: (v: SecondaryFieldConfig[]) => void;
  secondaryFieldsReadOnly?: SecondaryFieldConfig[];
  secondaryFieldsEditable?: SecondaryFieldConfig[];
  enableVoting?: boolean;
  setEnableVoting?: (v: boolean) => void;
  votingOptions?: string;
  setVotingOptions?: (v: string) => void;
}

export const DispatchSystemSection: React.FC<DispatchSystemSectionProps> = (props) => {
  const addObservationField = () => {
    if (props.setObservationFields && props.observationFields) {
      props.setObservationFields([...props.observationFields, { id: crypto.randomUUID(), field: '', label: '', type: 'text' }]);
    }
  };

  const updateObservationField = (index: number, key: keyof SecondaryFieldConfig, value: any) => {
    if (props.setObservationFields && props.observationFields) {
      const arr = [...props.observationFields];
      arr[index] = { ...arr[index], [key]: value };
      props.setObservationFields(arr);
    }
  };

  const removeObservationField = (index: number) => {
    if (props.setObservationFields && props.observationFields) {
      const arr = [...props.observationFields];
      arr.splice(index, 1);
      props.setObservationFields(arr);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DispatchConfiguration {...props} />
      <ObservationConfiguration 
        {...props} 
        addObservationField={addObservationField}
        updateObservationField={updateObservationField}
        removeObservationField={removeObservationField}
      />
      <VotingConfiguration {...props} />
    </div>
  );
};
