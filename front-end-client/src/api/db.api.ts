import { collection, getDocs, getDoc, doc, setDoc, query, orderBy, limit, writeBatch, deleteDoc, getCountFromServer, startAfter, startAt, where, documentId, arrayUnion } from 'firebase/firestore';
import { z } from 'zod';
import SHA256 from 'crypto-js/sha256';
import { logger, sanitizeErrorForTelemetry } from '../lib/logger.util';

const genericDocSchema = z.record(z.string(), z.any());

export interface FetchMetadata {
  totalCount: number;
}

export interface HybridResponse<T> {
  data: T[];
  metadata: FetchMetadata;
}

export const getDocsAPI = async (db: any, path: string): Promise<HybridResponse<any>> => {

  const colRef = collection(db, path);
  
  const countSnap = await getCountFromServer(colRef);
  const totalCount = countSnap.data().count;

  const snap = await getDocs(colRef);
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  return { data, metadata: { totalCount } };
};

export const setDocAPI = async (db: any, path: string, docId: string, data: any) => {
  const validatedData = genericDocSchema.parse(data);
  const docRef = doc(db, path, docId);
  await setDoc(docRef, validatedData, { merge: true });
};

export interface QueryOptions {
  orderField: string;
  lmt: number;
  startAfterDoc?: any;
  startAtDoc?: any;
}

export const executeQueryAPI = async (db: any, path: string, options: QueryOptions): Promise<HybridResponse<any>> => {
  const colRef = collection(db, path);
  
  const countSnap = await getCountFromServer(colRef);
  const totalCount = countSnap.data().count;

  let queryConstraints: any[] = [orderBy(options.orderField, 'desc'), limit(options.lmt)];
  
  if (options.startAfterDoc) {
     queryConstraints.push(startAfter(options.startAfterDoc));
  } else if (options.startAtDoc) {
     queryConstraints.push(startAt(options.startAtDoc));
  }

  const q = query(colRef, ...queryConstraints);
  const snap = await getDocs(q);
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  return { data, metadata: { totalCount } };
};

export const getBatchAPI = (db: any) => {
  return writeBatch(db);
};

export const getDocRefAPI = (db: any, path: string, docId?: string) => {
  if (docId) return doc(db, path, docId);
  return doc(collection(db, path));
};

export const deleteDocAPI = async (db: any, path: string, docId: string) => {
  const docRef = doc(db, path, docId);
  await deleteDoc(docRef);
};

const ALLOWED_PUBLIC_KEYS = new Set([
  'id', 'relationalId', 'departmentId', 'tenantId', 'status', 'type', 'code', 'action', 'title', 'name', 'label',
  'description', 'category', 'date', 'timestamp', 'createdAt', 'updatedAt', 'priority', 'order', 'url', 'link',
  'icon', 'color', 'version', 'active', 'public', 'readOnly', 'collection', 'pageName', 'functionName', 'recordId',
  'role', 'permissions', 'assignedArea', 'createdBy', 'updatedBy', 'author', 'year', 'month', 'day', 'value',
  'amount', 'quantity', 'total', 'count', 'summary', 'details', 'observations', 'notes', 'tags', 'options', 'data'
]);

const isSensitive = (key: string, value: any): boolean => {
  const isKeyUnlisted = !ALLOWED_PUBLIC_KEYS.has(key);
  const isValueSensitive = typeof value === "string" ? value.includes("@") : false;
  return isKeyUnlisted || isValueSensitive;
};

const hashValue = (val: any): string => {
  const salt = import.meta.env.VITE_DB_SALT || import.meta.env.VITE_LOG_SALT;
  if (!salt) {
    throw new Error("INFRASTRUCTURE_ERROR: VITE_DB_SALT or VITE_LOG_SALT environment variable is required for PII anonymization (LGPD Art. 13).");
  }
  return SHA256(String(val) + salt).toString();
};

const sanitizeRecord = (record: any) => {
  const safeRecord: any = {};
  for (const key of Object.keys(record)) {
    safeRecord[key] = isSensitive(key, record[key]) ? hashValue(record[key]) : record[key];
  }
  return safeRecord;
};

const generateRecordId = (r: any): string => {
  if (r.id) return String(r.id);
  return crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);
};

const SanitizeRequestSchema = z.object({
  records: z.array(z.any())
});

const SanitizeResponseSchema = z.object({
  sanitizedRecords: z.array(z.any())
});

const validateSanitizeInput = (records: any[]): { records: any[] } => {
  return SanitizeRequestSchema.parse({ records });
};

const sendSanitizeHttpRequest = async (payload: { records: any[] }): Promise<Response> => {
  return fetch('/api/security/sanitize-pii', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include'
  });
};

const parseSanitizeHttpResponse = async (response: Response): Promise<any[] | null> => {
  if (!response.ok) return null;
  const rawData = await response.json().catch(() => ({}));
  const parsed = SanitizeResponseSchema.safeParse(rawData);
  return parsed.success ? parsed.data.sanitizedRecords : null;
};

export const sanitizeRecordsViaBackend = async (records: any[]): Promise<any[]> => {
  try {
    const payload = validateSanitizeInput(records);
    const response = await sendSanitizeHttpRequest(payload);
    const result = await parseSanitizeHttpResponse(response);
    if (result) return result;
  } catch (error) {
  }
  return records.map(rawRecord => sanitizeRecord(rawRecord));
};

const dispatchWorker = (worker: Worker, safeRecords: any[], maxBytes: number): Promise<any[][]> => {
  return new Promise<any[][]>((resolve, reject) => {
    worker.onmessage = (e: MessageEvent<any>) => {
      if (e.data.type === 'CHUNK_RECORDS_RESULT') {
        resolve(e.data.payload.chunks);
      } else if (e.data.type === 'ERROR') {
        reject(new Error(e.data.payload.message));
      }
      worker.terminate();
    };
    worker.onerror = (e) => {
      reject(e);
      worker.terminate();
    };
    worker.postMessage({ 
      type: 'CHUNK_RECORDS', 
      payload: { records: safeRecords, maxBytes } 
    });
  });
};

export const ingestBatchedRecordsAPI = async (db: any, collectionName: string, records: any[]) => {
  const MAX_BYTES = 750 * 1024;
  
  const preparedRecords = records.map(rawRecord => ({ ...rawRecord, id: generateRecordId(rawRecord) }));

  const worker = new Worker(new URL('../workers/semantic-parser.worker.ts', import.meta.url), { type: 'module' });

  try {
    const chunks = await dispatchWorker(worker, preparedRecords, MAX_BYTES);

    for (let i = 0; i < chunks.length; i++) {
      const docId = `parte${i + 1}`;
      await setDoc(doc(db, collectionName, docId), { [collectionName]: chunks[i] });
    }
  } finally {
    worker.terminate();
  }
};


const extractLastPartNumber = (docs: any[]): number => {
  let lastPartNumber = 1;
  docs.forEach((d: any) => {
    const partMatch = d.id?.match(/^parte(\d+)$/);
    if (partMatch) lastPartNumber = Math.max(lastPartNumber, parseInt(partMatch[1], 10));
  });
  return lastPartNumber;
};

const checkNeedsNewChunk = (targetArray: any[], newItem: any): boolean => {
  const currentSize = new Blob([JSON.stringify(targetArray.concat(newItem))]).size;
  return currentSize > 750 * 1024 || targetArray.length >= 900;
};

export const appendToChunkArrayAPI = async (
  db: any, targetCollection: string, newItem: any
) => {
  const docsRes = await getDocsAPI(db, targetCollection);
  const docsReq = docsRes.data || [];
  
  const lastPartNumber = extractLastPartNumber(docsReq);
  let targetPartId = `parte${lastPartNumber}`;
  const lastPartDoc = docsReq.find((d: any) => d.id === targetPartId);
  let targetPartArray = lastPartDoc && Array.isArray(lastPartDoc[targetCollection]) ? lastPartDoc[targetCollection] : [];
  
  if (checkNeedsNewChunk(targetPartArray, newItem)) {
     targetPartId = `parte${lastPartNumber + 1}`;
     targetPartArray = [];
  }
  
  targetPartArray.push(newItem);
  await setDocAPI(db, targetCollection, targetPartId, { [targetCollection]: targetPartArray });
};

export const appendMovementRecordAPI = async (db: any, baseCollectionName: string, relationalId: string, record: any) => {
  const collectionName = `fm_${baseCollectionName}`;
  if (!relationalId || relationalId === 'undefined') {
    throw new Error('Relational ID cannot be undefined');
  }
  const preparedRecord = { ...record, id: record.id || generateRecordId(record) };
  preparedRecord.relationalId = relationalId;
  await appendToChunkArrayAPI(db, collectionName, preparedRecord);
};

export const getDocAPI = async (db: any, path: string, docId: string): Promise<any> => {
  try {
    const docRef = doc(db, path, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error: any) {
    logger.error("ERR_GET_DOC", sanitizeErrorForTelemetry(error));
    throw error;
  }
};
