import React, { useState, useEffect } from 'react';
import { Send, UserCheck, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useMappingStore } from '../../store/mappingStore';
import { TenantConfig } from '../../types/index';
import { getTenantFirestore } from '../../api/tenant.factory';
import { getDocsAPI } from '../../api/db.api';
import { logger, sanitizeErrorForTelemetry } from '../../lib/logger.util';

interface DispatchFormProps {
  tenant: TenantConfig;
  selectedItem: any;
}

export const MappedPageDispatchForm: React.FC<DispatchFormProps> = ({ tenant, selectedItem }) => {
  const { updateMappedFields, appendDispatchRecord } = useMappingStore();
  const { user } = useAuthStore();
  const [dispatchTo, setDispatchTo] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [movements, setMovements] = useState<any[]>([]);
  const [isLoadingFm, setIsLoadingFm] = useState(false);

  const mapping = selectedItem._colConfig || selectedItem._mapping;
  const relationalKeyField = mapping.components?.dispatchRelationalKey;
  const primaryIdField = mapping?.primaryFields?.idField;
  
  let rawRelationalId = relationalKeyField ? selectedItem[relationalKeyField] : undefined;
  if (rawRelationalId === undefined || rawRelationalId === null || rawRelationalId === '') {
    rawRelationalId = primaryIdField ? selectedItem[primaryIdField] : undefined;
  }
  if (rawRelationalId === undefined || rawRelationalId === null || rawRelationalId === '') {
    rawRelationalId = selectedItem._originalId || selectedItem._id || selectedItem.id;
  }
  
  const relationalIdValue = (rawRelationalId !== undefined && rawRelationalId !== null && rawRelationalId !== '') ? String(rawRelationalId) : null;

  const loadFmData = async () => {
    setIsLoadingFm(true);
    try {
      if (!user || !user.uid) {
         console.warn('[SIG3_WARN]: Operação rejeitada. Usuário não autenticado.');
         return;
      }
      const db = getTenantFirestore(tenant);
      if (db && relationalIdValue && relationalIdValue !== 'undefined') {
        const collectionName = `fm_${mapping.collectionName}`;
        const docsRes = await getDocsAPI(db, collectionName);
        let allMovements: any[] = [];
        docsRes.data?.forEach((d: any) => {
           const arr = d[collectionName] || d.movements || [];
           if (Array.isArray(arr)) {
              allMovements = allMovements.concat(arr);
           }
        });

        const filteredMovements = allMovements.filter(m => String(m.relationalId) === String(relationalIdValue));

        if (filteredMovements.length === 0 && docsRes.data) {
           const safeRelationalId = relationalIdValue.replace(/\//g, '_');
           const legacyDoc = docsRes.data.find((d: any) => d._id === safeRelationalId || d.id === safeRelationalId);
           if (legacyDoc && legacyDoc.movements) {
              setMovements(legacyDoc.movements || []);
              return;
           }
        }
        
        setMovements(filteredMovements || []);
      }
    } catch (e) {
      logger.error('ERR_LOAD_FM_DATA', sanitizeErrorForTelemetry(e));
    } finally {
      setIsLoadingFm(false);
    }
  };

  useEffect(() => {
    loadFmData();
  }, [selectedItem, relationalIdValue]);

  const lastMovement = movements.length > 0 ? movements[movements.length - 1] : null;
  const currentDispatchState = (lastMovement && lastMovement.status === 'dispatched') ? lastMovement : null;

  const handleRegisterDispatch = async () => {
    if (!relationalIdValue || relationalIdValue === 'undefined') {
      return alert('Erro: ID Relacional não encontrado para este registro.');
    }
    if (!dispatchTo) return alert('Selecione um destinatário.');
    const dispatchStatus = mapping.components?.dispatchStatus || mapping.dispatchStatus;
    if (!dispatchStatus) return alert('Status de saída não configurado pelo admin.');

    setIsDispatching(true);
    try {
      if (!user || !user.uid) {
         console.warn('[SIG3_WARN]: Operação rejeitada. Usuário não autenticado.');
         return;
      }
      const now = new Date().toISOString();
      const newStatus = dispatchStatus;

      const dispatchData = {
        status: 'dispatched',
        dispatchedAt: now,
        dispatchedBy: user?.uid || '',
        dispatchedByName: user?.name || 'Desconhecido',
        dispatchedTo: dispatchTo,
      };

      const payload = {
        [mapping?.primaryFields?.status || 'status']: newStatus
      };

      const historyRecord = {
        relationalId: relationalIdValue,
        relationalKey: relationalKeyField || 'id',
        itemTitle: selectedItem[mapping?.primaryFields?.processNumber || 'processNumber'] || selectedItem[mapping?.primaryFields?.name || 'name'] || 'N/A',
        ...dispatchData,
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15)
      };

      await updateMappedFields(tenant, selectedItem, payload);
      await appendDispatchRecord(tenant, mapping.collectionName, relationalIdValue, historyRecord);
      
      setDispatchTo('');
      await loadFmData();
    } catch (e: any) {
      alert("Erro ao registrar saída. Operação abortada por segurança.");
      logger.error('ERR_DISPATCH_OUTBOUND', sanitizeErrorForTelemetry(e));
    } finally {
      setIsDispatching(false);
    }
  };

  const handleRegisterReturn = async () => {
    if (!relationalIdValue || relationalIdValue === 'undefined') {
      return alert('Erro: ID Relacional não encontrado para este registro.');
    }
    const returnStatus = mapping.components?.returnStatus || mapping.returnStatus;
    if (!returnStatus) return alert('Status de devolução não configurado pelo admin.');

    setIsDispatching(true);
    try {
      if (!user || !user.uid) {
         console.warn('[SIG3_WARN]: Operação rejeitada. Usuário não autenticado.');
         return;
      }
      const now = new Date().toISOString();
      const newStatus = returnStatus;

      const completedDispatch = { 
         ...currentDispatchState, 
         status: 'returned',
         returnedAt: now, 
         returnedBy: user?.uid || '',
         returnedByName: user?.name || 'Desconhecido',
      };

      const payload = {
        [mapping?.primaryFields?.status || 'status']: newStatus
      };

      const historyRecord = {
        relationalId: relationalIdValue,
        relationalKey: relationalKeyField || 'id',
        itemTitle: selectedItem[mapping?.primaryFields?.processNumber || 'processNumber'] || selectedItem[mapping?.primaryFields?.name || 'name'] || 'N/A',
        ...completedDispatch,
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15)
      };

      await updateMappedFields(tenant, selectedItem, payload);
      await appendDispatchRecord(tenant, mapping.collectionName, relationalIdValue, historyRecord);
      
      await loadFmData();
    } catch (e: any) {
      alert("Erro ao registrar devolução. Operação abortada por segurança.");
      logger.error('ERR_DISPATCH_RETURN', sanitizeErrorForTelemetry(e));
    } finally {
      setIsDispatching(false);
    }
  };

  const completedMovements = movements.filter(m => m.status === 'returned').reverse().slice(0, 5);

  return (
    <div className="bg-[var(--color-brand-main)]/5 p-4 rounded-xl border border-[var(--color-brand-main)]/20">
      <h4 className="text-xs uppercase font-bold text-[var(--color-brand-main)] mb-3 flex items-center">
         Formulário de Movimentação
      </h4>
      
      {isLoadingFm ? (
        <p className="text-xs text-[var(--color-content-tertiary)] italic py-2">Carregando...</p>
      ) : !currentDispatchState ? (
         <div className="space-y-4">
           <div>
             <label className="block text-xs font-semibold text-[var(--color-content-secondary)] mb-1">Destinatário da Saída</label>
             <select
               className="w-full bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded px-3 py-2 text-sm text-[var(--color-content-primary)] focus:outline-none focus:border-[var(--color-brand-main)] focus:ring-0 transition-colors"
               value={dispatchTo}
               onChange={e => setDispatchTo(e.target.value)}
             >
               <option value="">Selecione o setor/destinatário...</option>
               {(mapping.components?.dispatchToOptions || mapping.dispatchToOptions)?.split(',').map((opt: string) => (
                 <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
               ))}
             </select>
           </div>
           <Button variant="primary" className="w-full !bg-blue-600 hover:!bg-blue-700 !text-white !border-0" onClick={handleRegisterDispatch} disabled={isDispatching || !dispatchTo}>
              <Send size={14} className="mr-2" />
              {isDispatching ? 'Registrando...' : 'Registrar Saída do Processo'}
           </Button>
         </div>
      ) : (
         <div className="space-y-3">
           <div className="flex items-start bg-white p-3 rounded-lg border border-[var(--color-border-default)]">
              <Clock size={16} className="text-[var(--color-brand-main)] mr-2 mt-0.5" />
              <div className="text-sm text-[var(--color-content-primary)]">
                <span className="font-bold block text-[var(--color-content-secondary)]">Status: Em Trânsito (Saída)</span>
                Para: {currentDispatchState.dispatchedTo}<br/>
                Por: {currentDispatchState.dispatchedByName || 'Desconhecido'}<br/>
                Em: {new Date(currentDispatchState.dispatchedAt).toLocaleString('pt-BR')}
              </div>
           </div>
           <Button variant="primary" className="w-full !bg-emerald-600 hover:!bg-emerald-700 !text-white !border-0" onClick={handleRegisterReturn} disabled={isDispatching}>
              <UserCheck size={14} className="mr-2" />
              {isDispatching ? 'Registrando...' : 'Registrar Devolução'}
           </Button>
         </div>
      )}

      {completedMovements.length > 0 && (
         <div className="mt-4 pt-3 border-t border-[var(--color-border-default)]">
            <p className="text-xs font-bold text-[var(--color-content-secondary)] mb-2">Últimas Tramitações</p>
            <div className="space-y-2">
               {completedMovements.map((hist: any, i: number) => (
                  <div key={i} className="text-xs bg-[var(--color-content-inverse)] p-2 rounded-lg border border-[var(--color-border-default)] text-[var(--color-content-secondary)] leading-tight">
                     <strong>Ida:</strong> {hist.dispatchedTo} por {hist.dispatchedByName || 'Desconhecido'} ({new Date(hist.dispatchedAt).toLocaleDateString('pt-BR')})<br/>
                     <strong>Volta:</strong> por {hist.returnedByName || 'Desconhecido'} ({new Date(hist.returnedAt).toLocaleDateString('pt-BR')})
                  </div>
               ))}
            </div>
         </div>
      )}
    </div>
  );
};
