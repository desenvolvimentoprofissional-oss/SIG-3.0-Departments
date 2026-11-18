import { filterUsers, filterDepartments, filterNotices } from '../lib/filters.util';

export type WorkerInputMessage = 
  | { type: 'PARSE_SNAPSHOT'; payload: { docs: { id: string; data: any }[]; col: any; mapping: any; index: number; listenerId?: string } }
  | { type: 'PARSE_CALENDAR'; payload: { items: any[] } }
  | { type: 'FILTER_USERS'; payload: { users: any[]; currentUser: any; tenants: any[]; query: string; filterArea: string; filterDept: string; filterStatus: string } }
  | { type: 'FILTER_DEPARTMENTS'; payload: { rawDepts: any[]; user: any; tenants: any[]; query: string; filterArea: string; filterDept: string; filterStatus: string } }
  | { type: 'FILTER_NOTICES'; payload: { notices: any[]; user: any; query: string; filterArea: string; filterDept: string; filterStatus: string } };

export type WorkerOutputMessage = 
  | { type: 'PARSE_RESULT'; collectionName?: string; index?: number; mappingId?: string; listenerId?: string; payload: any[] }
  | { type: 'CALENDAR_RESULT'; payload: Record<string, any[]> }
  | { type: 'FILTER_USERS_RESULT'; payload: any[] }
  | { type: 'FILTER_DEPARTMENTS_RESULT'; payload: any[] }
  | { type: 'FILTER_NOTICES_RESULT'; payload: any[] };

const formatToYYYYMMDD = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

self.onmessage = (e: MessageEvent<WorkerInputMessage>) => {
  const msg = e.data;
  
  if (msg.type === 'PARSE_SNAPSHOT') {
    const { docs, col, mapping, index, listenerId } = msg.payload;
    const parsedDocs: any[] = [];
    
    for (let i = 0; i < docs.length; i++) {
      const { id, data } = docs[i];
      if (col.docName) {
        if (col.docNameType === 'EXACT' && id !== col.docName) {
          continue;
        } else if (col.docNameType === 'PREFIX' && !id.startsWith(col.docName)) {
          continue;
        }
      } else {
        if (id.startsWith('config') || id.startsWith('metadata')) { 
          continue;
        }
      }
      const originalId = id.split('_')[0];
      
      const passUniversalFilter = (item: any, colConfig: any) => {
        if (colConfig.__isMainCollection === false) return true;
        
        let filters: any[] = [];
        
        if (colConfig.universalFilters && Array.isArray(colConfig.universalFilters)) {
           filters = [...colConfig.universalFilters];
        } else if (colConfig.universalFilter && colConfig.universalFilter.column) {
           filters.push(colConfig.universalFilter);
        } else if (colConfig.universalFilterColumn) {
           filters.push({ column: colConfig.universalFilterColumn, value: colConfig.universalFilterValue, operator: '==' });
        }
        
        if (filters.length === 0) return true;

        for (const filter of filters) {
          if (!filter.column) continue;
          const val = item[filter.column];
          
          let itemValuesStr: string[] = [];
          if (val != null) {
              if (Array.isArray(val)) {
                 itemValuesStr = val.map(v => String(v).toLowerCase().trim());
              } else {
                 itemValuesStr = [String(val).toLowerCase().trim()];
              }
          }
          
          const filterValStr = String(filter.value || '').toLowerCase().trim();
          const operator = filter.operator || '==';
          
          let match = false;
          
          if (itemValuesStr.length === 0) {
              if (operator === '!=' || operator === 'not-contains') {
                  match = true;
              } else {
                  match = false;
              }
          } else {
              for (const itemValStr of itemValuesStr) {
                 if (operator === '==') {
                    if (itemValStr === filterValStr) match = true;
                 } else if (operator === '!=') {
                    if (itemValStr !== filterValStr) match = true;
                 } else if (operator === 'contains') {
                    if (itemValStr.includes(filterValStr)) match = true;
                 } else if (operator === 'not-contains') {
                    if (!itemValStr.includes(filterValStr)) match = true;
                 } else if (operator === 'starts-with') {
                    if (itemValStr.startsWith(filterValStr)) match = true;
                 } else if (operator === 'ends-with') {
                    if (itemValStr.endsWith(filterValStr)) match = true;
                 } else {
                    const itemNum = Number(val);
                    const filterNum = Number(filter.value);
                    const isNum = !isNaN(itemNum) && !isNaN(filterNum);
                    
                    if (operator === '>') {
                       if (isNum ? itemNum > filterNum : itemValStr > filterValStr) match = true;
                    } else if (operator === '<') {
                       if (isNum ? itemNum < filterNum : itemValStr < filterValStr) match = true;
                    } else if (operator === '>=') {
                       if (isNum ? itemNum >= filterNum : itemValStr >= filterValStr) match = true;
                    } else if (operator === '<=') {
                       if (isNum ? itemNum <= filterNum : itemValStr <= filterValStr) match = true;
                    }
                 }
              }
              
              if (operator === '!=') {
                 
                 match = itemValuesStr.every(v => v !== filterValStr);
              } else if (operator === 'not-contains') {
                 match = itemValuesStr.every(v => !v.includes(filterValStr));
              }
          }
          
          if (!match) return false;
        }
        
        return true;
      };
      
      let hasArray = false;
      const keys = Object.keys(data);
      for (let j = 0; j < keys.length; j++) {
        const k = keys[j];
        const val = data[k];
        const isObjArray = val && typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length > 0 && Object.keys(val).every(key => !isNaN(Number(key)));
        
        if (Array.isArray(val) || isObjArray || k === 'processos') {
          hasArray = true;
          const arr = Array.isArray(val) ? val : Object.values(val || {});
          for (let arrIdx = 0; arrIdx < arr.length; arrIdx++) {
            const arrItem = arr[arrIdx] as any;
            const parsedItem = {
              ...arrItem,
              _id: `${id}_${arrIdx}`,
              id: arrItem.id !== undefined ? arrItem.id : `${id}_${arrIdx}`,
              _originalId: originalId,
              _arrayIndex: arrIdx,
              _collection: col.collectionName,
              _collectionId: col.id,
              _mapping: mapping,
              _colConfig: col
            };
            if (passUniversalFilter(parsedItem, col)) {
              parsedDocs.push(parsedItem);
            }
          }
        }
      }
      
      if (!hasArray) {
        const parsedItem = {
          ...data,
          _id: id,
          id: data.id !== undefined ? data.id : id,
          _originalId: originalId,
          _collection: col.collectionName,
              _collectionId: col.id,
          _mapping: mapping,
          _colConfig: col
        };
        if (passUniversalFilter(parsedItem, col)) {
          parsedDocs.push(parsedItem);
        }
      }
    }
    
    self.postMessage({
      type: 'PARSE_RESULT',
      collectionName: col.collectionName,
      index,
      mappingId: mapping?.id,
      listenerId,
      payload: parsedDocs
    } as WorkerOutputMessage);

  } else if (msg.type === 'PARSE_CALENDAR') {
    const { items } = msg.payload;
    const map: Record<string, any[]> = {};
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const dateVal = item._computedDateField;
      
      if (dateVal) {
        let dateStrToMatch = '';
        const dateStr = String(dateVal).trim();
        
        if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
          dateStrToMatch = dateStr.substring(0, 10);
        } else {
          const d = new Date(dateVal);
          if (!isNaN(d.getTime())) {
            dateStrToMatch = formatToYYYYMMDD(d);
          } else {
            dateStrToMatch = dateStr.split('T')[0].split(' ')[0];
          }
        }
        
        if (!map[dateStrToMatch]) map[dateStrToMatch] = [];
        map[dateStrToMatch].push(item);
      } else {
        if (!map['uncategorized']) map['uncategorized'] = [];
        map['uncategorized'].push(item);
      }
    }
    
    self.postMessage({
      type: 'CALENDAR_RESULT',
      payload: map
    } as WorkerOutputMessage);

  } else if (msg.type === 'FILTER_USERS') {
    const p = msg.payload;
    const result = filterUsers(p.users, p.currentUser, p.tenants, p.query, p.filterArea, p.filterDept, p.filterStatus);
    self.postMessage({ type: 'FILTER_USERS_RESULT', payload: result } as WorkerOutputMessage);
  } else if (msg.type === 'FILTER_DEPARTMENTS') {
    const p = msg.payload;
    const result = filterDepartments(p.rawDepts, p.user, p.tenants, p.query, p.filterArea, p.filterDept, p.filterStatus);
    self.postMessage({ type: 'FILTER_DEPARTMENTS_RESULT', payload: result } as WorkerOutputMessage);
  } else if (msg.type === 'FILTER_NOTICES') {
    const p = msg.payload;
    const result = filterNotices(p.notices, p.user, p.query, p.filterArea, p.filterDept, p.filterStatus);
    self.postMessage({ type: 'FILTER_NOTICES_RESULT', payload: result } as WorkerOutputMessage);
  }
};
