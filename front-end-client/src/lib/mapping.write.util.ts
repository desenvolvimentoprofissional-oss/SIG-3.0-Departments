export const extractSequenceNumber = (pNum: any): number => {
  if (typeof pNum !== 'string') return 0;
  const parts = pNum.split('/');
  return parts.length === 2 ? (parseInt(parts[0], 10) || 0) : 0;
};

export const extractArrayField = (data: Record<string, any>): string => {
  return Object.keys(data).find(k => Array.isArray(data[k])) || 'processos';
};

export const findHighestInArray = (arr: any[], primaryField: string): number => {
  return arr.reduce((max, item) => Math.max(max, extractSequenceNumber(item[primaryField])), 0);
};

export const validarPedaçoDeCargaPaga = (docsReq: any[], primaryField: string) => {
  return docsReq.reduce((acc, data) => {
    const partMatch = data.id?.match(/^parte(\d+)$/);
    if (!partMatch) return acc;
    
    const lastPartNumber = Math.max(acc.lastPartNumber, parseInt(partMatch[1], 10));
    
    const arrayFieldName = extractArrayField(data);
    const docMax = Array.isArray(data[arrayFieldName]) 
      ? findHighestInArray(data[arrayFieldName], primaryField)
      : extractSequenceNumber(data[primaryField]);
      
    return {
      highestFound: Math.max(acc.highestFound, docMax),
      lastPartNumber,
      arrayFieldName
    };
  }, { highestFound: 0, lastPartNumber: 1, arrayFieldName: 'processos' });
};

export const buildProcessPayload = (mapping: any, formData: Record<string, any>, highestFound: number): any => {
  const currentYear = new Date().getFullYear();
  const nextSequenceNumber = Math.max(mapping.createProcessSequenceStart || 0, highestFound + 1);
  const primaryField = mapping.primaryFields.processNumber;
  const generatedNumberStr = `${String(nextSequenceNumber).padStart(6, '0')}/${currentYear}`;
  
  const payload: Record<string, any> = { 
     id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15), 
     updatedAt: Date.now(), 
     createdAt: Date.now(), 
     [primaryField]: generatedNumberStr
  };

  mapping.createProcessFields?.forEach((f: any) => { payload[f.name] = formData[f.name]; });
  Object.values(mapping.primaryFields).forEach((pf: any) => { payload[pf] = payload[pf] ?? ''; });
  payload[primaryField] = generatedNumberStr; 
  
  return { payload, generatedNumberStr };
};

export const processFirestoreLimits = async (targetPartArray: any[], payload: any): Promise<boolean> => {
  const MAX_BYTES = 750 * 1024;
  const worker = new Worker(new URL('../workers/semantic-parser.worker.ts', import.meta.url), { type: 'module' });

  return new Promise<boolean>((resolve, reject) => {
    worker.onmessage = (e: MessageEvent<any>) => {
      resolve(e.data?.payload?.shouldCreateNewPart || false);
      worker.terminate();
    };
    worker.onerror = (e) => {
      reject(e);
      worker.terminate();
    };
    worker.postMessage({ 
       type: 'CHECK_PAYLOAD_SIZE', 
       payload: { targetArray: targetPartArray, newObj: payload, maxBytes: MAX_BYTES, maxItems: 900 } 
     });
  });
};

export const extractTargetPartArray = (docsReq: any[], targetPartId: string, arrayFieldName: string): any[] => {
  const lastPartDoc = docsReq.find(d => d.id === targetPartId);
  return lastPartDoc && Array.isArray(lastPartDoc[arrayFieldName]) ? lastPartDoc[arrayFieldName] : [];
};

export const prepareFieldsForUpdate = async (fieldsToUpdate: Record<string, any>) => {
  const processedFields = { ...fieldsToUpdate };
  for (const key in processedFields) {
    if (processedFields[key] === '__DELETE_FIELD__') {
      const { deleteField } = await import('firebase/firestore');
      processedFields[key] = deleteField();
    }
  }
  return processedFields;
};

export const applyArrayUpdate = (
  docData: any, 
  arrayIndex: number, 
  fieldsToUpdate: Record<string, any>
): { arrName: string; arr: any[] } | null => {
  const arrayKeys = Object.keys(docData).filter(k => Array.isArray(docData[k]));
  if (arrayKeys.length > 0) {
    const arrName = arrayKeys[0];
    const arr = [...docData[arrName]];
    if (arr[arrayIndex]) {
      Object.keys(fieldsToUpdate).forEach(k => {
        if (fieldsToUpdate[k] === '__DELETE_FIELD__') { 
          delete arr[arrayIndex][k];
        } else { 
          arr[arrayIndex][k] = fieldsToUpdate[k];
        }
      });
      return { arrName, arr };
    }
  }
  return null;
};
