import { useState, useEffect, useRef } from 'react';
import { ViewMappingConfig, SecondaryFieldConfig, ComponentConfig, UniversalFilter, CustomActionConfig } from '../../../../types/index';

interface UseViewConfigFormStateProps {
  extractedFields: string[];
  initialConfig?: ViewMappingConfig | null;
  onSave: (config: ViewMappingConfig) => void;
}

export const useViewConfigFormState = ({
  extractedFields,
  initialConfig,
  onSave
}: UseViewConfigFormStateProps) => {
  const isMountedRef = useRef(false);
  const initialConfigRef = useRef(initialConfig);

  const [universalFilters, setUniversalFilters] = useState<UniversalFilter[]>(
    initialConfig?.universalFilters || 
    (initialConfig?.universalFilter ? [initialConfig.universalFilter] : [])
  );

  const [mappedPrimary, setMappedPrimary] = useState(initialConfig?.primaryFields || {
    status: '', processNumber: '', createdAt: '', tagField: '', name: '', cpfCnpj: '', responsibleEmail: '', avatarField: '', tramiteTimeField: ''
  });

  const [mappedSecondaryReadOnly, setMappedSecondaryReadOnly] = useState<SecondaryFieldConfig[]>(initialConfig?.secondaryFieldsReadOnly || []);
  const [mappedSecondaryEditable, setMappedSecondaryEditable] = useState<SecondaryFieldConfig[]>(initialConfig?.secondaryFieldsEditable || []);
  
  const [mappedKanbanColumn, setMappedKanbanColumn] = useState<string>(initialConfig?.kanbanColumnField || '');
  const [mappedCalendarDateField, setMappedCalendarDateField] = useState<string>(initialConfig?.calendarDateField || '');
  const [mappedPriorityQuadrantField, setMappedPriorityQuadrantField] = useState<string>(initialConfig?.priorityQuadrantField || '');
  const [mappedPriorityDescriptionField, setMappedPriorityDescriptionField] = useState<string>(initialConfig?.priorityDescriptionField || '');
  const [mappedSlaStartDateField, setMappedSlaStartDateField] = useState<string>(initialConfig?.slaStartDateField || '');
  const [mappedSlaDurationDays, setMappedSlaDurationDays] = useState<number>(initialConfig?.slaDurationDays || 0);

  const [searchFields, setSearchFields] = useState<string[]>(initialConfig?.components?.searchFields || []);
  const [filterFields, setFilterFields] = useState<string[]>(initialConfig?.components?.filterFields || []);
  const [filterLabels, setFilterLabels] = useState<Record<string, string>>(initialConfig?.components?.filterLabels || {});
  const [groupingFields, setGroupingFields] = useState<string[]>(initialConfig?.components?.groupingFields || []);

  const [enableDispatchSystem, setEnableDispatchSystem] = useState<boolean>(initialConfig?.components?.enableDispatchSystem || false);
  const [dispatchToOptions, setDispatchToOptions] = useState<string>(initialConfig?.components?.dispatchToOptions || '');
  const [dispatchStatus, setDispatchStatus] = useState<string>(initialConfig?.components?.dispatchStatus || '');
  const [dispatchRelationalKey, setDispatchRelationalKey] = useState<string>(initialConfig?.components?.dispatchRelationalKey || '');
  const [returnStatus, setReturnStatus] = useState<string>(initialConfig?.components?.returnStatus || '');
  const [enableObservations, setEnableObservations] = useState<boolean>(initialConfig?.components?.enableObservations || false);
  const [observationRelationalKey, setObservationRelationalKey] = useState<string>(initialConfig?.components?.observationRelationalKey || '');
  const [observationGoogleSheetUrl, setObservationGoogleSheetUrl] = useState<string>(initialConfig?.components?.observationGoogleSheetUrl || '');
  const [observationGoogleSheetTab, setObservationGoogleSheetTab] = useState<string>(initialConfig?.components?.observationGoogleSheetTab || '');
  const [observationSheetColumnIdRelacional, setObservationSheetColumnIdRelacional] = useState<string>(initialConfig?.components?.observationSheetColumnIdRelacional || '');
  const [observationSheetColumnDate, setObservationSheetColumnDate] = useState<string>(initialConfig?.components?.observationSheetColumnDate || '');
  const [observationSheetColumnObservation, setObservationSheetColumnObservation] = useState<string>(initialConfig?.components?.observationSheetColumnObservation || '');
  const [observationSheetColumnStatus, setObservationSheetColumnStatus] = useState<string>(initialConfig?.components?.observationSheetColumnStatus || '');
  const [observationSheetColumnStatusText, setObservationSheetColumnStatusText] = useState<string>(initialConfig?.components?.observationSheetColumnStatusText || '');
  const [observationSheetColumnDetails, setObservationSheetColumnDetails] = useState<string>(initialConfig?.components?.observationSheetColumnDetails || '');
  const [observationSheetColumnDetailsText, setObservationSheetColumnDetailsText] = useState<string>(initialConfig?.components?.observationSheetColumnDetailsText || '');
  const [observationFields, setObservationFields] = useState<SecondaryFieldConfig[]>(initialConfig?.components?.observationFields || []);
  const [enableVoting, setEnableVoting] = useState<boolean>(initialConfig?.components?.enableVoting || false);
  const [votingOptions, setVotingOptions] = useState<string>(initialConfig?.components?.votingOptions || '');
  const [auditConfig, setAuditConfig] = useState<any>(initialConfig?.components?.auditConfig || undefined);
  const [customActions, setCustomActions] = useState<CustomActionConfig[]>(initialConfig?.components?.customActions || []);

  const fieldOptions = [{ value: '', label: 'Selecione um campo...' }, ...extractedFields.map(f => ({ value: f, label: f }))];

  const addSecondaryField = (type: 'readonly' | 'editable') => {
    const newField: SecondaryFieldConfig = { id: crypto.randomUUID(), field: '', label: '', type: 'text' };
    if (type === 'readonly') setMappedSecondaryReadOnly([...mappedSecondaryReadOnly, newField]);
    else setMappedSecondaryEditable([...mappedSecondaryEditable, newField]);
  };

  const updateSecondaryField = (type: 'readonly' | 'editable', index: number, key: keyof SecondaryFieldConfig, value: any) => {
    if (type === 'readonly') {
      const arr = [...mappedSecondaryReadOnly];
      arr[index] = { ...arr[index], [key]: value };
      setMappedSecondaryReadOnly(arr);
    } else {
      const arr = [...mappedSecondaryEditable];
      arr[index] = { ...arr[index], [key]: value };
      setMappedSecondaryEditable(arr);
    }
  };

  const removeSecondaryField = (type: 'readonly' | 'editable', index: number) => {
    if (type === 'readonly') setMappedSecondaryReadOnly(mappedSecondaryReadOnly.filter((_, i) => i !== index));
    else setMappedSecondaryEditable(mappedSecondaryEditable.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const components: ComponentConfig = {
      searchFields,
      filterFields,
      filterLabels,
      groupingFields,
      enabledViews: {
        kanban: !!mappedKanbanColumn,
        list: true,
        calendar: !!mappedCalendarDateField,
        table: true,
        matrix: !!mappedPriorityQuadrantField,
        sla: !!mappedSlaStartDateField,
        auditoria: !!auditConfig?.columns?.length
      },
      enableDispatchSystem,
      dispatchToOptions,
      dispatchStatus,
      returnStatus,
      dispatchRelationalKey,
      enableObservations,
      observationRelationalKey,
      observationGoogleSheetUrl,
      observationGoogleSheetTab,
      observationSheetColumnIdRelacional,
      observationSheetColumnDate,
      observationSheetColumnObservation,
      observationSheetColumnStatus,
      observationSheetColumnStatusText,
      observationSheetColumnDetails,
      observationSheetColumnDetailsText,
      observationFields,
      enableVoting,
      votingOptions,
      auditConfig,
      customActions
    };

    const config: ViewMappingConfig = { 
       universalFilters,
       primaryFields: mappedPrimary, 
       secondaryFieldsReadOnly: mappedSecondaryReadOnly, 
       secondaryFieldsEditable: mappedSecondaryEditable, 
       kanbanColumnField: mappedKanbanColumn, 
       calendarDateField: mappedCalendarDateField, 
       priorityQuadrantField: mappedPriorityQuadrantField, 
       priorityDescriptionField: mappedPriorityDescriptionField, 
       slaStartDateField: mappedSlaStartDateField, 
       slaDurationDays: mappedSlaDurationDays, 
       components 
    }; 
    
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    if (initialConfigRef.current !== initialConfig) {
      initialConfigRef.current = initialConfig;
      return;
    }
    
    onSave(config);
  }, [ 
    universalFilters, mappedPrimary, mappedSecondaryReadOnly, mappedSecondaryEditable, 
    mappedKanbanColumn, mappedCalendarDateField, mappedPriorityQuadrantField, mappedPriorityDescriptionField, 
    mappedSlaStartDateField, mappedSlaDurationDays, searchFields, filterFields, filterLabels, groupingFields, 
    enableDispatchSystem, dispatchToOptions, dispatchStatus, returnStatus, dispatchRelationalKey, enableObservations, observationRelationalKey, observationGoogleSheetUrl, observationGoogleSheetTab, observationSheetColumnIdRelacional, observationSheetColumnDate, observationSheetColumnObservation, observationSheetColumnStatus, observationSheetColumnStatusText, observationSheetColumnDetails, observationSheetColumnDetailsText, observationFields, enableVoting, votingOptions, auditConfig, customActions
  ]);

  return {
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
    fieldOptions,
    addSecondaryField,
    updateSecondaryField,
    removeSecondaryField
  };
};
