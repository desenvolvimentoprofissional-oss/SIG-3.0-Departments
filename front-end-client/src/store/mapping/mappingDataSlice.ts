import { 
  assembleCollectionsToFetch, 
  joinRelationalDatasets, 
  anonymizeConvidadoData, 
  parseRelationalOptions, 
  resolveItemIdentifiers, 
  computeNewDateValue 
} from "../../lib/mappingData.parsers";
import { useAuthStore } from "../authStore";
import { StateCreator } from 'zustand';
import { TenantConfig, PageMapping } from '../../types/index';
import { getTenantFirestore } from '../../api/tenant.factory';
import { listenToMappingCollectionsAPI, subscribeToCollectionUpdateAPI } from '../../api/mapping.read.api';
import { updateMappedFieldsAPI } from '../../api/mapping.write.api';
import { appendMovementRecordAPI } from '../../api/db.api';
import type { WorkerInputMessage, WorkerOutputMessage } from '../../workers/semantic-parser.worker';
import { MappingStateSlice } from './mappingStateSlice';
import { logger, sanitizeErrorForTelemetry } from '../../lib/logger.util';

export interface MappingDataSlice {
  listenToMappingCollections: (tenant: TenantConfig, mapping: PageMapping) => () => void;
  subscribeToCollectionUpdate: (tenant: TenantConfig, collectionName: string) => () => void;
  updateMappedDate: (tenant: TenantConfig, item: any, newDate: string, dateField?: string) => Promise<void>;
  updateMappedFields: (tenant: TenantConfig, item: any, fields: Record<string, any>) => Promise<void>;
  appendDispatchRecord: (tenant: TenantConfig, baseCollection: string, relationalId: string, record: any) => Promise<void>;
  createMappedProcess: (tenant: TenantConfig, mapping: any, formData: Record<string, any>) => Promise<void>;
  extractSchema: (tenant: TenantConfig, colName: string, prefix?: string, docNameType?: 'EXACT' | 'PREFIX') => Promise<string[]>;
  ingestRecords: (tenant: TenantConfig, colName: string, records: any[]) => Promise<void>;
  fetchRelationalOptions: (tenant: TenantConfig, collectionName: string, filterField?: string, filterValue?: string, displayField?: string) => Promise<{label: string, value: string}[]>;
}

const parserWorker = new Worker(new URL('../../workers/semantic-parser.worker.ts', import.meta.url), { type: 'module' });

const setNestedValue = (obj: any, path: string, value: any): any => {
  const parts = path.split('.');
  if (parts.length === 1) {
    return { ...obj, [path]: value };
  }
  const result = { ...obj };
  let current = result;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    current[part] = { ...(current[part] || {}) };
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
  return result;
};

export const createMappingDataSlice: StateCreator<
  MappingStateSlice & MappingDataSlice,
  [],
  [],
  MappingDataSlice
> = (set, get) => ({
  listenToMappingCollections: (tenant, mapping) => {
    set({ pageDataLoading: true, pageData: [], pageDataError: null });
    
    const listenerId = Math.random().toString(36).substring(7);

    const db = getTenantFirestore(tenant);
    const dSources = mapping.dataSources || ((mapping as any).dataSource ? [(mapping as any).dataSource] : []);
    const useDataSource = dSources.length > 0 && dSources.some(ds => ds.mainCollection);
    
    const collectionsToFetch = assembleCollectionsToFetch(mapping, useDataSource);

    if (collectionsToFetch.length === 0) {
      set({ pageDataLoading: false });
      return () => {};
    }

    const allData = new Map<string, any[]>();
    const loadedKeys = new Set<string>();
    
    const onWorkerMessage = (e: MessageEvent<WorkerOutputMessage>) => {
      const result = e.data;
      if (result.type === 'PARSE_RESULT' && (result.collectionName || result.index !== undefined)) {
        if (result.mappingId && result.mappingId !== mapping.id) return;
        if (result.listenerId && result.listenerId !== listenerId) return;
        const key = result.index !== undefined ? String(result.index) : result.collectionName!;
        allData.set(key, result.payload);
        loadedKeys.add(key);
        if (loadedKeys.size === collectionsToFetch.length) {
          if (mapping.pageType !== 'RESULTADOS' && useDataSource) {
            const allMainData = joinRelationalDatasets(dSources, allData);
            set({ pageData: allMainData, pageDataLoading: false });
          } else {
             set({ pageData: Array.from(allData.values()).flat(), pageDataLoading: false });
          }
        }
      }
    };
    
    parserWorker.addEventListener('message', onWorkerMessage);
    
    const unsubs = collectionsToFetch.map((col, index) => {
      if (!col) return () => {};

      const mappingConfig = useDataSource ? (col.__parentDsViewConfig || mapping.viewConfig || col) : col;
      
      const injectedMappingConfig = { ...mappingConfig, collectionName: col.collectionName, __isMainCollection: col.__isMainCollection, id: col.id };
      
      const targetDocName = col.docName || col.documentNamePrefix;
      let targetDocNameType = col.docNameType;
      if (!targetDocNameType && targetDocName) {
        targetDocNameType = col.documentNamePrefix ? 'PREFIX' : 'EXACT';
      }

      const user = useAuthStore.getState().user;
      const isConvidado = user?.role === 'CONVIDADO';

      return listenToMappingCollectionsAPI(
        db, 
        col.collectionName,
        (docs) => {
          parserWorker.postMessage({
             type: 'PARSE_SNAPSHOT',
             payload: { docs: docs.map(d => ({ id: d._id, data: anonymizeConvidadoData({ ...d, _id: undefined }, isConvidado) })), col: injectedMappingConfig, mapping, index, listenerId }
          } as WorkerInputMessage);
        }, 
        (err) => {
           logger.error('ERR_FETCH_COLLECTION', sanitizeErrorForTelemetry(err));
           set({ pageDataError: err.message, pageDataLoading: false });
        },
        targetDocName,
        targetDocNameType
      );
    });
    
    return () => {
      unsubs.forEach(u => u());
      parserWorker.removeEventListener('message', onWorkerMessage);
    };
  },

  updateMappedDate: async (tenant, item, newDate, passedDateField?: string) => {
    const db = getTenantFirestore(tenant);
    const { originalId, arrayIndex } = resolveItemIdentifiers(item);
    const dateField = passedDateField || item._colConfig?.calendarDateField || item._mapping?.calendarDateField;
    if (!dateField) throw new Error("Sem campo de data");
    
    const dateValueToSave = computeNewDateValue(item, dateField, newDate);

    set(state => ({
      pageData: state.pageData.map(d => d._id === item._id ? setNestedValue(d, dateField, dateValueToSave) : d)
    }));
    
    await updateMappedFieldsAPI(db, item._collection, originalId, arrayIndex, { [dateField]: dateValueToSave });
  },

  appendDispatchRecord: async (tenant, baseCollection, relationalId, record) => {
    try {
      const db = getTenantFirestore(tenant);
      await appendMovementRecordAPI(db, baseCollection, relationalId, record);
    } catch (error) {
      logger.error("ERR_APPEND_DISPATCH", sanitizeErrorForTelemetry(error));
      throw error;
    }
  },

  updateMappedFields: async (tenant, item, fields) => {
    const db = getTenantFirestore(tenant);
    const { originalId, arrayIndex } = resolveItemIdentifiers(item);
    
    set(state => ({
      pageData: state.pageData.map(d => {
        if (d._id !== item._id) return d;
        let updatedDoc = { ...d };
        for (const [key, value] of Object.entries(fields)) {
          updatedDoc = setNestedValue(updatedDoc, key, value);
        }
        return updatedDoc;
      })
    }));
    
    await updateMappedFieldsAPI(db, item._collection, originalId, arrayIndex, fields);
  },

  createMappedProcess: async (tenant, mapping, formData) => {
    const db = getTenantFirestore(tenant);
    const { createMappedProcessAPI } = await import('../../api/mapping.write.api');
    await createMappedProcessAPI(db, mapping, formData);
  },

  extractSchema: async (tenant, colName, prefix, docNameType) => {
    const { extractCollectionSchemaConfig } = await import('../../api/tenant.factory');
    return extractCollectionSchemaConfig(tenant, colName, prefix, docNameType);
  },

  ingestRecords: async (tenant, colName, records) => {
    const db = getTenantFirestore(tenant);
    const { ingestBatchedRecordsAPI } = await import('../../api/db.api');
    await ingestBatchedRecordsAPI(db, colName, records);
  },

  fetchRelationalOptions: async (tenant, collectionName, filterField, filterValue, displayField) => {
    const db = getTenantFirestore(tenant);
    const { getDocsAPI } = await import('../../api/db.api');
    const docsSnap = await getDocsAPI(db, collectionName);
    return parseRelationalOptions(docsSnap.data, filterField, filterValue, displayField);
  },

  subscribeToCollectionUpdate: (tenant, collectionName) => {
    const authStore = useAuthStore.getState();
    if (!authStore.user || !tenant || !collectionName) {
      set({ ultimaAtualizacaoDoc: null });
      return () => {};
    }

    const db = getTenantFirestore(tenant);
    const unsubscribe = subscribeToCollectionUpdateAPI(
      db,
      collectionName,
      (docData) => {
        set({ ultimaAtualizacaoDoc: docData });
      },
      (err) => {
        unsubscribe();
        logger.error('ERR_FETCH_ATUALIZACAO', sanitizeErrorForTelemetry(err));
        set({ ultimaAtualizacaoDoc: null });
      }
    );
    return () => {
      unsubscribe();
    };
  },
});

