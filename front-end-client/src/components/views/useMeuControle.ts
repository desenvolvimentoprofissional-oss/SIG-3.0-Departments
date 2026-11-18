import { useState, useEffect } from 'react';
import { useMappingStore } from '../../store/mappingStore';
import { useAuthStore } from '../../store/authStore';
import { getTenantFirestore } from '../../api/tenant.factory';
import { getMeuControleDoc } from '../../api/mapping.read.api';
import { addObservation, registerVote } from '../../api/mapping.write.api';
import { appendObservationToSheet } from '../../api/sheets.api';
import { isFieldVisible, validateFieldValue } from '../../lib/fieldValidation.util';
import { logger, sanitizeErrorForTelemetry } from '../../lib/logger.util';

export const useMeuControle = (tenant: any, selectedItem: any) => {
  const { updateMappedFields } = useMappingStore();
  const { user } = useAuthStore();
  
  const [editedFields, setEditedFields] = useState<Record<string, any>>({});
  const [newObservation, setNewObservation] = useState('');
  const [observationFieldsData, setObservationFieldsData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [mcData, setMcData] = useState<{ observations: any[], votes: any[] } | null>(null);
  const [isLoadingMc, setIsLoadingMc] = useState(false);

  const hasEditableFields = (selectedItem._colConfig || selectedItem._mapping).secondaryFieldsEditable && (selectedItem._colConfig || selectedItem._mapping).secondaryFieldsEditable.length > 0;
  const hasObservations = (selectedItem._colConfig || selectedItem._mapping).components?.enableObservations || (selectedItem._colConfig || selectedItem._mapping).enableObservations;
  const observationFields = (selectedItem._colConfig || selectedItem._mapping).components?.observationFields || (selectedItem._colConfig || selectedItem._mapping).observationFields || [];
  const hasVoting = (selectedItem._colConfig || selectedItem._mapping).components?.enableVoting || (selectedItem._colConfig || selectedItem._mapping).enableVoting;
  const votingOptionsRaw = (selectedItem._colConfig || selectedItem._mapping).components?.votingOptions || (selectedItem._colConfig || selectedItem._mapping).votingOptions;
  const votingOptionsList = votingOptionsRaw ? votingOptionsRaw.split(',').map((s: string) => s.trim()) : [];

  const getCleanProcessId = () => {
    const observationRelationalKey = (selectedItem._colConfig || selectedItem._mapping)?.components?.observationRelationalKey;
    const idField = (selectedItem._colConfig || selectedItem._mapping)?.primaryFields?.idField;
    let rawId = observationRelationalKey ? selectedItem[observationRelationalKey] : undefined;
    if (rawId === undefined || rawId === null || rawId === '') {
      rawId = idField ? selectedItem[idField] : undefined;
    }
    if (rawId === undefined || rawId === null || rawId === '') {
      rawId = selectedItem._originalId || selectedItem._id || selectedItem.id;
    }
    if (rawId === undefined || rawId === null || rawId === '') {
       return null;
    }
    let idStr = String(rawId);
    return idStr.replace(/\//g, '_');
  };

  const loadMeuControleData = async () => {
    if (!hasObservations && !hasVoting) return;
    setIsLoadingMc(true);
    try {
      if (!user || !user.uid) return;
      const db = getTenantFirestore(tenant);
      const processId = getCleanProcessId();
      if (db && processId && processId !== 'undefined') {
        const data = await getMeuControleDoc(db, selectedItem._collection, processId);
        if (data) {
          setMcData({ observations: data.observations || [], votes: data.votes || [] });
        } else {
          setMcData({ observations: [], votes: [] });
        }
      }
    } catch (e) {
      logger.error('ERR_MEU_CONTROLE_LOAD', sanitizeErrorForTelemetry(e));
    } finally {
      setIsLoadingMc(false);
    }
  };

  useEffect(() => {
    if (selectedItem && hasEditableFields) {
      const initialFields: Record<string, any> = {};
      (selectedItem._colConfig || selectedItem._mapping).secondaryFieldsEditable.forEach((f: any) => {
        initialFields[f.field] = selectedItem[f.field];
      });
      setEditedFields(initialFields);
    }
    setNewObservation('');
    loadMeuControleData();
  }, [selectedItem]);

  const handleFieldChange = (field: string, value: any, type: string) => {
     let parsedValue = value;
     if (type === 'boolean') {
        parsedValue = value === 'true' ? true : value === 'false' ? false : undefined;
     } else if (type === 'number') {
        parsedValue = value ? Number(value) : null;
     }
     setEditedFields(prev => ({ ...prev, [field]: parsedValue }));
  };

  const hasFieldChanges = hasEditableFields && Object.keys(editedFields).some(key => editedFields[key] !== selectedItem[key]);
  const hasObservationData = newObservation.trim().length > 0 || Object.values(observationFieldsData).some(v => v !== undefined && v !== '');
  const mergedData = { ...selectedItem, ...editedFields, ...observationFieldsData };

  const allFieldsValid = (() => {
    const checkFields = (fields: any[], data: Record<string, any>) => {
      if (!fields || !Array.isArray(fields)) return true;
      for (const f of fields) {
        if (!isFieldVisible(f, data, mergedData)) continue;
        const val = data[f.field];
        if (val !== undefined && val !== '') {
          const validation = validateFieldValue(f, val);
          if (!validation.isValid) return false;
        }
      }
      return true;
    };
    const editFields = (selectedItem._colConfig || selectedItem._mapping)?.secondaryFieldsEditable || [];
    return checkFields(editFields, editedFields) && checkFields(observationFields, observationFieldsData);
  })();

  const canSave = (hasFieldChanges || hasObservationData) && allFieldsValid;

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    try {
      if (!user || !user.uid) return;
      const db = getTenantFirestore(tenant);
      if (!db) throw new Error("Database not found");
      let payload: Record<string, any> = {};
      const editFields = (selectedItem._colConfig || selectedItem._mapping)?.secondaryFieldsEditable || [];
      if (hasFieldChanges) {
        Object.keys(editedFields).forEach(key => {
          const fieldConfig = editFields.find((f: any) => f.field === key);
          if (fieldConfig && !isFieldVisible(fieldConfig, editedFields, mergedData)) return;
          if (editedFields[key] !== selectedItem[key]) {
            payload[key] = editedFields[key];
          }
        });
      }
      if (hasObservations && hasObservationData) {
         observationFields.forEach((f: any) => {
            if (!isFieldVisible(f, observationFieldsData, mergedData)) return;
            const val = observationFieldsData[f.field];
            if (val !== undefined && val !== selectedItem[f.field]) {
               payload[f.field] = val;
            }
         });
      }
      if (Object.keys(payload).length > 0) {
        await updateMappedFields(tenant, selectedItem, payload);
      }
      if (hasObservations && hasObservationData) {
        const processId = getCleanProcessId();
        const relationalKey = (selectedItem._colConfig || selectedItem._mapping)?.components?.observationRelationalKey;
        const googleSheetUrl = (selectedItem._colConfig || selectedItem._mapping)?.components?.observationGoogleSheetUrl;
        const googleSheetTab = (selectedItem._colConfig || selectedItem._mapping)?.components?.observationGoogleSheetTab;
        const sheetColumnIdRelacional = (selectedItem._colConfig || selectedItem._mapping)?.components?.observationSheetColumnIdRelacional;
        const sheetColumnDate = (selectedItem._colConfig || selectedItem._mapping)?.components?.observationSheetColumnDate;
        const sheetColumnObservation = (selectedItem._colConfig || selectedItem._mapping)?.components?.observationSheetColumnObservation;
        const sheetColumnStatus = (selectedItem._colConfig || selectedItem._mapping)?.components?.observationSheetColumnStatus;
        const sheetColumnStatusText = (selectedItem._colConfig || selectedItem._mapping)?.components?.observationSheetColumnStatusText;
        const sheetColumnDetails = (selectedItem._colConfig || selectedItem._mapping)?.components?.observationSheetColumnDetails;
        const sheetColumnDetailsText = (selectedItem._colConfig || selectedItem._mapping)?.components?.observationSheetColumnDetailsText;

        const visibleObsData: Record<string, any> = {};
        observationFields.forEach((f: any) => {
          if (isFieldVisible(f, observationFieldsData, mergedData) && observationFieldsData[f.field] !== undefined) {
            visibleObsData[f.field] = observationFieldsData[f.field];
          }
        });

        if (processId && processId !== 'undefined') {
          await addObservation(db, selectedItem._collection, processId, newObservation.trim(), {
            userId: user?.uid || '',
            userName: user?.name || 'Desconhecido'
          }, visibleObsData, relationalKey);

          if (googleSheetUrl) {
            try {
              const rowValues = [
                new Date().toLocaleString('pt-BR'),
                user?.name || 'Desconhecido',
                processId,
                newObservation.trim(),
                ...observationFields.map((f: any) => isFieldVisible(f, observationFieldsData, mergedData) ? (observationFieldsData[f.field] || '') : '')
              ];

              const additionalFieldsMapping = observationFields.reduce((acc: any, f: any) => {
                if (f.sheetColumn && isFieldVisible(f, observationFieldsData, mergedData)) {
                  acc[f.sheetColumn] = observationFieldsData[f.field] || '';
                }
                return acc;
              }, {});

              const updates = {
                 ...additionalFieldsMapping
              };

              if (sheetColumnDate) updates[sheetColumnDate] = new Date().toLocaleString('pt-BR');
              if (sheetColumnObservation) updates[sheetColumnObservation] = newObservation.trim();
              if (sheetColumnStatus) updates[sheetColumnStatus] = sheetColumnStatusText || 'Pendente';
              if (sheetColumnDetails) updates[sheetColumnDetails] = sheetColumnDetailsText || '';

              await appendObservationToSheet(
                googleSheetUrl,
                googleSheetTab,
                sheetColumnIdRelacional,
                processId,
                updates
              );
            } catch (sheetError: any) {
              logger.error('ERR_GOOGLE_SHEETS', sanitizeErrorForTelemetry(sheetError));
              alert("Erro ao salvar na planilha. Falha de comunicação.");
            }
          }

          setNewObservation('');
          await loadMeuControleData();
        } else {
          alert('Erro: ID Relacional não encontrado para este registro.');
        }
      }
    } catch (e: any) {
      logger.error('ERR_MEU_CONTROLE_SAVE', sanitizeErrorForTelemetry(e));
      alert("Operação abortada por segurança.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleVote = async (voteValue: string) => {
    if (!user || !user.uid) return;
    setIsSaving(true);
    try {
      const db = getTenantFirestore(tenant);
      const processId = getCleanProcessId();
      if (db && processId && processId !== 'undefined') {
        await registerVote(db, selectedItem._collection, processId, voteValue, {
          userId: user.uid || '',
          userName: user.name || 'Desconhecido',
          userAvatar: user.avatarUrl || ''
        });
        await loadMeuControleData();
      } else {
        alert('Erro: ID Relacional não encontrado para este registro.');
      }
    } catch (e: any) {
      logger.error('ERR_MEU_CONTROLE_VOTE', sanitizeErrorForTelemetry(e));
      alert("Operação abortada por segurança.");
    } finally {
      setIsSaving(false);
    }
  };

  const observations = mcData?.observations ? [...mcData.observations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];
  const votes = mcData?.votes || [];
  const userHasVoted = votes.some(v => v.userId === user?.uid);

  useEffect(() => {
    const initialObsData: Record<string, any> = {};
    observationFields.forEach((f: any) => {
      if (selectedItem[f.field] !== undefined && selectedItem[f.field] !== null) {
        initialObsData[f.field] = selectedItem[f.field];
      }
    });
    if (observations.length > 0) {
      const latestObs = observations[0];
      observationFields.forEach((f: any) => {
        if (latestObs[f.field] !== undefined && latestObs[f.field] !== null && latestObs[f.field] !== '') {
          initialObsData[f.field] = latestObs[f.field];
        }
      });
    }
    setObservationFieldsData(initialObsData);
  }, [mcData, selectedItem]);

  return {
    editedFields,
    newObservation,
    setNewObservation,
    observationFieldsData,
    setObservationFieldsData,
    isSaving,
    isLoadingMc,
    hasEditableFields,
    hasObservations,
    observationFields,
    hasVoting,
    votingOptionsList,
    handleFieldChange,
    canSave,
    handleSave,
    handleVote,
    observations,
    votes,
    userHasVoted
  };
};
