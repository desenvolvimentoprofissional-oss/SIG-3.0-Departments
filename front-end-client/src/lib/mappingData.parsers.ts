import { anonymizeCPF, pseudonymizeEmail } from "./crypto.util";

export function assembleCollectionsToFetch(mapping: any, useDataSource: boolean): any[] {
  let collectionsToFetch: any[] = [];
  if (useDataSource && mapping.dataSources) {
    const dSources = mapping.dataSources || ((mapping as any).dataSource ? [(mapping as any).dataSource] : []);
    dSources.forEach((ds: any) => {
      if (ds.mainCollection) {
        collectionsToFetch.push({ 
          ...ds.mainCollection, 
          __parentDsViewConfig: ds.viewConfig, 
          __isMainCollection: true 
        });
      }
      if (ds.relationalCollections) {
        ds.relationalCollections.forEach((r: any) => {
          collectionsToFetch.push({ 
            ...r, 
            __parentDsViewConfig: ds.viewConfig, 
            __isMainCollection: false 
          });
        });
      }
    });
  } else {
    collectionsToFetch = mapping.collections || [];
  }
  return collectionsToFetch;
}

export function joinRelationalDatasets(dSources: any[], allData: Map<string, any[]>): any[] {
  let allMainData: any[] = [];
  let globalCollectionIndex = 0;
  
  dSources.forEach(ds => {
    if (!ds.mainCollection) return;
    
    const mDataKey = String(globalCollectionIndex++);
    let mainData = allData.get(mDataKey) || [];
    const relationalMapsByCol = new Map<string, Map<string, any>>();
    
    (ds.relationalCollections || []).forEach((r: any) => {
      const relList = allData.get(String(globalCollectionIndex++)) || [];
      const relMap = new Map<string, any>();
      if (r.joinForeignField) {
        relList.forEach(relItem => {
          const foreignVal = relItem[r.joinForeignField!];
          if (foreignVal != null) {
            const key = String(foreignVal);
            if (!relMap.has(key)) {
              relMap.set(key, relItem);
            }
          }
        });
      }
      relationalMapsByCol.set(r.collectionName, relMap);
    });

    mainData = mainData.map(mainItem => {
      let joined = { ...mainItem };
      (ds.relationalCollections || []).forEach((r: any) => {
        const relMap = relationalMapsByCol.get(r.collectionName);
        const localVal = r.joinLocalField ? mainItem[r.joinLocalField] : undefined;
        if (localVal != null && relMap && r.joinForeignField) {
          const match = relMap.get(String(localVal));
          if (match) {
            joined = { ...joined, ...match };
          }
        }
      });
      return joined;
    });
    allMainData = allMainData.concat(mainData);
  });
  
  return allMainData;
}

export function anonymizeConvidadoData(data: any, isConvidado: boolean): any {
  if (!isConvidado) return data;
  const newData = { ...data };
  const fieldsToAnonymizeCpf = ['cpf', 'cpfCnpj'];
  const fieldsToAnonymizeEmail = ['email', 'responsibleEmail', 'emailResponsavel'];
  
  fieldsToAnonymizeCpf.forEach(f => {
    if (newData[f]) newData[f] = anonymizeCPF(newData[f]);
  });
  fieldsToAnonymizeEmail.forEach(f => {
    if (newData[f]) newData[f] = pseudonymizeEmail(newData[f]);
  });
  
  return newData;
}

export function parseRelationalOptions(
  docsSnapData: any[], 
  filterField?: string, 
  filterValue?: string, 
  displayField?: string
): { label: string; value: string }[] {
  let allItems: any[] = [];
  docsSnapData.forEach((d: any) => {
    if (d.id.startsWith('config') || d.id.startsWith('metadata')) {
      return;
    }
    let hasArray = false;
    Object.keys(d).forEach(k => {
      const val = d[k];
      const isObjArray = val && typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length > 0 && Object.keys(val).every(key => !isNaN(Number(key)));
      if (Array.isArray(val) || isObjArray || k === 'processos') {
        hasArray = true;
        const arr = Array.isArray(val) ? val : Object.values(val || {});
        allItems.push(...arr);
      }
    });
    if (!hasArray) {
      allItems.push({ id: d.id, ...d });
    }
  });

  if (filterField && filterValue) {
    allItems = allItems.filter(item => item[filterField] === filterValue);
  }

  const newOptions = allItems.map(item => {
    const dValue = displayField ? item[displayField] : (item.name || item.id || JSON.stringify(item));
    return { label: dValue, value: dValue };
  }).filter(o => o.label);

  return Array.from(new Map(newOptions.map(item => [item.value, item])).values());
}

export function resolveItemIdentifiers(item: any): { originalId: string; arrayIndex: number | null } {
  const originalId = item._originalId || String(item._id).split('_')[0];
  const arrayIndex = item._arrayIndex !== undefined ? item._arrayIndex : (String(item._id).includes('_') ? parseInt(String(item._id).split('_')[1], 10) : null);
  return { originalId, arrayIndex };
}

export function computeNewDateValue(item: any, dateField: string, newDate: string): string | null {
  let dateValueToSave: string | null = newDate || null;
  if (newDate) {
    const rawVal = dateField.split('.').reduce((acc, part) => acc && acc[part], item);
    if (typeof rawVal === 'string' && rawVal.includes(' ')) {
      dateValueToSave = `${newDate} ${rawVal.split(' ')[1]}`;
    } else if (typeof rawVal === 'string' && rawVal.includes('T')) {
      dateValueToSave = `${newDate}T${rawVal.split('T')[1]}`;
    } else {
      // Default to noon UTC if we don't have a time component to prevent timezone shifts
      dateValueToSave = `${newDate}T12:00:00Z`;
    }
  }
  return dateValueToSave;
}
