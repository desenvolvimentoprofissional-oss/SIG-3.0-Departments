import { FirebaseApp } from 'firebase/app';
import { Firestore, collection, getDocs, limit, query, documentId, orderBy, startAt, endAt, doc, getDoc } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { TenantConfig } from '../types/index';
import { useConnectionStore } from '../store/connectionStore';

export const getTenantApp = (tenant: TenantConfig): FirebaseApp => {
  return useConnectionStore.getState().getTenantApp(tenant);
};

export const getTenantAuth = (tenant: TenantConfig): Auth => {
  return getAuth(getTenantApp(tenant));
};

export const getTenantFirestore = (tenant: TenantConfig): Firestore => {
  return useConnectionStore.getState().getTenantFirestore(tenant);
};

const buildSchemaQuery = (colRef: any, prefix?: string) => {
  if (prefix) {
    return query(colRef, orderBy(documentId()), startAt(prefix), endAt(prefix + '\uf8ff'), limit(1));
  }
  return query(colRef, limit(5));
};

const isValidObject = (val: any) => {
  return val && typeof val === 'object' && !Array.isArray(val);
};

const checkPseudoKeys = (keys: string[]) => {
  if (keys.length === 0) return false;
  return keys.every(k => !isNaN(Number(k)));
};

const isPseudoArray = (val: any) => {
  if (!isValidObject(val)) return false;
  return checkPseudoKeys(Object.keys(val));
};

const extractFromList = (list: any[], allKeys: Set<string>) => {
  list.forEach(item => {
    if (item && typeof item === 'object') {
      Object.keys(item).forEach(k => allKeys.add(k));
    }
  });
};

const checkIsArrayLike = (val: any): boolean => Array.isArray(val) || isPseudoArray(val);

const isArrayContainer = (key: string, val: any): boolean => {
  if (key === 'processos') return true;
  return checkIsArrayLike(val);
};

const extractArrayValues = (val: any, allKeys: Set<string>) => {
  const list = Array.isArray(val) ? val : Object.values(val || {});
  extractFromList(list, allKeys);
};

const addRootKeys = (hasArray: boolean, data: any, allKeys: Set<string>) => {
  if (hasArray) return;
  Object.keys(data).forEach(k => allKeys.add(k));
};

const extractKeysFromData = (data: any, allKeys: Set<string>) => {
  let hasArray = false;
  for (const key of Object.keys(data)) {
    if (isArrayContainer(key, data[key])) {
      hasArray = true;
      extractArrayValues(data[key], allKeys);
    }
  }
  addRootKeys(hasArray, data, allKeys);
};

const fetchExactSchemaDocs = async (db: Firestore, collectionName: string, docName: string) => {
  const docRef = doc(db, collectionName, docName);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return [];
  
  const allKeys = new Set<string>();
  extractKeysFromData(docSnap.data(), allKeys);
  return Array.from(allKeys).sort();
};

const fetchPrefixSchemaDocs = async (db: Firestore, collectionName: string, prefix?: string) => {
  const colRef = collection(db, collectionName);
  const q = buildSchemaQuery(colRef, prefix);
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return [];
  
  const allKeys = new Set<string>();
  snapshot.docs.forEach(doc => extractKeysFromData(doc.data(), allKeys));
  return Array.from(allKeys).sort();
};

export const extractCollectionSchemaConfig = async (tenant: TenantConfig, collectionName: string, documentPrefix?: string, docNameType?: 'EXACT' | 'PREFIX'): Promise<string[]> => {
  try {
    const db = getTenantFirestore(tenant);
    
    if (documentPrefix && docNameType === 'EXACT') {
      return await fetchExactSchemaDocs(db, collectionName, documentPrefix);
    }
    
    return await fetchPrefixSchemaDocs(db, collectionName, documentPrefix);
  } catch (error) {
    console.error('[TENANT_FACTORY] - Operation aborted due to communication failure or infrastructure response.');
    throw error;
  }
};

const extractConfigString = (sdkString: string): string | null => {
  const configRegex = /const\s+firebaseConfig\s*=\s*({[^}]*})/;
  const match = sdkString.match(configRegex);
  return match ? match[1] : null;
};

const parseConfigPairs = (configStr: string): Record<string, string> => {
  const result: Record<string, string> = {};
  const kvRegex = /([a-zA-Z0-9_]+)\s*:\s*["']([^"']+)["']/g;
  let kvMatch;
  while ((kvMatch = kvRegex.exec(configStr)) !== null) {
    result[kvMatch[1]] = kvMatch[2];
  }
  return result;
};

const validateFirebaseConfig = (config: Record<string, string>): Record<string, string> | null => {
  if (!config.apiKey || !config.projectId) return null;
  return config;
};

export const parseFirebaseSDK = (sdkString: string): Record<string, string> | null => {
  try {
    const configStr = extractConfigString(sdkString);
    if (!configStr) return null;
    
    const config = parseConfigPairs(configStr);
    return validateFirebaseConfig(config);
  } catch (e) {
    return null;
  }
};
