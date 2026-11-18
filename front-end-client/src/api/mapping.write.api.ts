import { Firestore, collection, doc, setDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { PageMapping } from '../types/index';
import { getDocsAPI, setDocAPI, appendToChunkArrayAPI } from './db.api';
import {
  extractArrayField,
  findHighestInArray,
  validarPedaçoDeCargaPaga,
  buildProcessPayload,
  processFirestoreLimits,
  extractTargetPartArray,
  prepareFieldsForUpdate,
  applyArrayUpdate
} from '../lib/mapping.write.util';

export const saveMappingAPI = async (db: Firestore, mapping: PageMapping) => {
  const docRef = doc(db, 'system_page_mappings', mapping.id);
  const cleanData = JSON.parse(JSON.stringify({
    ...mapping,
    updatedAt: Date.now()
  }));
  await setDoc(docRef, cleanData, { merge: true });
};

export const deleteMappingAPI = async (db: Firestore, id: string) => {
  const docRef = doc(db, 'system_page_mappings', id);
  await deleteDoc(docRef);
};

export const dispatchMappedChunks = async (
  db: Firestore, 
  collectionName: string, 
  targetPartId: string, 
  arrayFieldName: string, 
  targetPartArray: any[],
  payload: any
) => {
  targetPartArray.push(payload);
  await setDocAPI(db, collectionName, targetPartId, { [arrayFieldName]: targetPartArray });
};

const fetchInitialMappingDocs = async (db: Firestore, isExact: boolean, mapping: any): Promise<any[]> => {
  if (isExact) {
    const docSnap = await getDoc(doc(db, mapping.collectionName, mapping.docName));
    if (docSnap.exists()) {
      return [{ id: docSnap.id, ...docSnap.data() }];
    }
    return [];
  } else {
    const docsRes = await getDocsAPI(db, mapping.collectionName);
    return docsRes.data;
  }
};

const getExactHighestFound = (docsReq: any[], arrayFieldName: string, mapping: any) => {
  if (docsReq.length === 0) return 0;
  return findHighestInArray(docsReq[0][arrayFieldName] || [], mapping.primaryFields.processNumber);
};

const extractExactMappingContext = (docsReq: any[], mapping: any) => {
  const arrayFieldName = extractArrayField(docsReq[0] || {});
  const realHighestFound = getExactHighestFound(docsReq, arrayFieldName, mapping);
  return { lastPartNumber: 1, arrayFieldName, realHighestFound };
};

const extractPrefixMappingContext = (docsReq: any[], mapping: any) => {
  const { highestFound, lastPartNumber, arrayFieldName } = validarPedaçoDeCargaPaga(docsReq, mapping.primaryFields.processNumber);
  return { lastPartNumber, arrayFieldName, realHighestFound: highestFound };
};

const extractMappingContext = (docsReq: any[], isExact: boolean, mapping: any) => {
  if (isExact) return extractExactMappingContext(docsReq, mapping);
  return extractPrefixMappingContext(docsReq, mapping);
};

const checkIsExactMapping = (mapping: any): boolean => {
  if (mapping.docNameType !== 'EXACT') return false;
  return Boolean(mapping.docName);
};

const resolveTargetPartId = (isExact: boolean, mapping: any, lastPartNumber: number): string => {
  if (isExact) return mapping.docName;
  return `parte${lastPartNumber}`;
};

const resolvePartitionOverflow = (
  shouldCreate: boolean,
  isExact: boolean,
  lastPartNumber: number,
  currentArray: any[],
  currentId: string
) => {
  if (!shouldCreate) return { targetPartId: currentId, targetPartArray: currentArray };
  if (isExact) return { targetPartId: currentId, targetPartArray: currentArray };
  return { targetPartId: `parte${lastPartNumber + 1}`, targetPartArray: [] };
};

export const createMappedProcessAPI = async (
  db: Firestore,
  mapping: any,
  formData: Record<string, any>
) => {
  const isExact = checkIsExactMapping(mapping);
  const docsReq = await fetchInitialMappingDocs(db, isExact, mapping);
  
  const { lastPartNumber, arrayFieldName, realHighestFound } = extractMappingContext(docsReq, isExact, mapping);
  const { payload, generatedNumberStr } = buildProcessPayload(mapping, formData, realHighestFound);
  
  const initialPartId = resolveTargetPartId(isExact, mapping, lastPartNumber);
  const initialPartArray = extractTargetPartArray(docsReq, initialPartId, arrayFieldName);
  
  const shouldCreateNewPart = await processFirestoreLimits(initialPartArray, payload);
  const { targetPartId, targetPartArray } = resolvePartitionOverflow(
    shouldCreateNewPart,
    isExact,
    lastPartNumber,
    initialPartArray,
    initialPartId
  );
  
  await dispatchMappedChunks(db, mapping.collectionName, targetPartId, arrayFieldName, targetPartArray, payload);
  return generatedNumberStr;
};

const processArrayUpdate = async (db: Firestore, collectionName: string, originalId: string, arrayIndex: number, fieldsToUpdate: Record<string, any>) => {
  const docRef = doc(db, collectionName, originalId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return;
  const updatePayload = applyArrayUpdate(docSnap.data(), arrayIndex, fieldsToUpdate);
  if (updatePayload) await updateDoc(docRef, { [updatePayload.arrName]: updatePayload.arr });
};

const processDirectUpdate = async (db: Firestore, collectionName: string, originalId: string, fieldsToUpdate: Record<string, any>) => {
  const docRef = doc(db, collectionName, originalId);
  const processedFields = await prepareFieldsForUpdate(fieldsToUpdate);
  await updateDoc(docRef, processedFields);
};

export const updateMappedFieldsAPI = async (
  db: Firestore,
  collectionName: string,
  originalId: string,
  arrayIndex: number | null,
  fieldsToUpdate: Record<string, any>
) => {
  if (arrayIndex !== null && typeof arrayIndex === 'number') {
    await processArrayUpdate(db, collectionName, originalId, arrayIndex, fieldsToUpdate);
  } else {
    await processDirectUpdate(db, collectionName, originalId, fieldsToUpdate);
  }
};

export const addObservation = async (
  db: Firestore, collectionName: string, processId: string, 
  text: string, userData: { userId: string; userName: string },
  extraData?: Record<string, any>, relationalIdKey?: string
) => {
  const targetCollection = `fo_${collectionName}`;
  const generatedId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
  const newObs = {
    _id: generatedId, id: generatedId, date: new Date().toISOString(),
    userId: userData.userId, userName: userData.userName, text,
    relationalId: processId, ...(relationalIdKey ? { [relationalIdKey]: processId } : {}), ...extraData
  };
  await appendToChunkArrayAPI(db, targetCollection, newObs);
};

export const registerVote = async (
  db: Firestore, collectionName: string, processId: string, voteValue: string,
  userData: { userId: string; userName: string; userAvatar?: string }
) => {
  const targetCollection = `fv_${collectionName}`;
  const newVote = {
    userId: userData.userId, userName: userData.userName, userAvatar: userData.userAvatar || '',
    voteValue, date: new Date().toISOString(), relationalId: processId
  };
  await appendToChunkArrayAPI(db, targetCollection, newVote);
};
