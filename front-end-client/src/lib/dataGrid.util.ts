import { getNestedValue } from '../templates/partials/DataGridRow';
import { ColumnDef } from '../templates/partials/DataGridHeader';
import { PageMapping } from '../types/index';
import { KanbanCardFields } from '../templates/KanbanTemplate';

function getDefaultColumns(): ColumnDef[] {
  return [
    { id: 'status', label: 'Status', type: 'string' },
    { id: 'name', label: 'Nome', type: 'string' },
    { id: 'processNumber', label: 'Número', type: 'string' },
    { id: 'cpfCnpj', label: 'Documento', type: 'string' },
    { id: 'tagField', label: 'Classificação', type: 'string' },
    { id: 'createdAt', label: 'Criado em', type: 'date' }
  ];
}

function extractViewConfigs(mapping: PageMapping, selectedCollectionFilter?: string): any[] {
  let configs: any[] = [];
  
  if (mapping.dataSources && mapping.dataSources.length > 0) {
    configs = mapping.dataSources.filter(ds => {
      if (selectedCollectionFilter && selectedCollectionFilter !== 'ALL') {
        return (ds.mainCollection?.id || ds.mainCollection?.collectionName) === selectedCollectionFilter;
      }
      return true;
    }).map(ds => ds.viewConfig).filter(Boolean);
  } else if (mapping.viewConfig) {
    configs = [mapping.viewConfig];
  } else {
    configs = mapping.collections || [];
    if (selectedCollectionFilter && selectedCollectionFilter !== 'ALL') {
      configs = configs.filter((c: any) => (c.id || c.collectionName) === selectedCollectionFilter);
    }
  }

  return configs;
}

function buildLabelsMap(viewConfigs: any[]): Record<string, string> {
  const labelsMap: Record<string, string> = {};
  for (const col of viewConfigs) {
    col.secondaryFieldsReadOnly?.forEach((f: any) => {
      if (f.label) labelsMap[f.field] = f.label;
    });
    col.secondaryFieldsEditable?.forEach((f: any) => {
      if (f.label) labelsMap[f.field] = f.label;
    });
  }
  return labelsMap;
}

function injectPrimaryFields(cols: Map<string, ColumnDef>, p: any, labelsMap: Record<string, string>) {
  if (!p) return;
  const fields = ['status', 'name', 'processNumber', 'cpfCnpj', 'createdAt', 'tagField'];
  for (const f of fields) {
    if (p[f]) {
      cols.set(p[f], { 
        id: p[f], 
        label: labelsMap[p[f]] || p[f], 
        type: f === 'createdAt' ? 'date' : 'string' 
      });
    }
  }
}

function injectSecondaryFields(cols: Map<string, ColumnDef>, col: any) {
  col.secondaryFieldsReadOnly?.forEach((f: any) => {
    cols.set(f.field, { id: f.field, label: f.label || f.field, type: f.type || 'string' });
  });
  col.secondaryFieldsEditable?.forEach((f: any) => {
    if (!cols.has(f.field)) {
      cols.set(f.field, { id: f.field, label: f.label || f.field, type: f.type || 'string' });
    }
  });
}

export const buildGridColumns = (
  mapping?: PageMapping,
  selectedCollectionFilter?: string
): ColumnDef[] => {
  if (!mapping) {
    return getDefaultColumns();
  }

  const cols = new Map<string, ColumnDef>();
  const viewConfigs = extractViewConfigs(mapping, selectedCollectionFilter);
  const labelsMap = buildLabelsMap(viewConfigs);

  for (const col of viewConfigs) {
    injectPrimaryFields(cols, col.primaryFields, labelsMap);
    injectSecondaryFields(cols, col);
  }

  return Array.from(cols.values());
};

function matchesAllFilters(
  item: any, 
  activeFilters: [string, string][], 
  mapping?: PageMapping, 
  getCardFields?: (item: any) => KanbanCardFields
): boolean {
  let fields: any = null;
  if (!mapping && getCardFields) {
    fields = getCardFields(item);
  }
  
  return activeFilters.every(([colId, lowerFilter]) => {
    const val = fields ? getNestedValue(item, fields[colId] || colId) : getNestedValue(item, colId);
    return val !== undefined && val !== null && String(val).toLowerCase().includes(lowerFilter);
  });
}

export const filterAndSortGridItems = (
  items: any[],
  filters: Record<string, string>,
  sortField: string,
  sortDirection: 'asc' | 'desc',
  mapping?: PageMapping,
  getCardFields?: (item: any) => KanbanCardFields
) => {
  const activeFilters = Object.entries(filters)
    .filter(([_, val]) => !!val)
    .map(([k, v]) => [k, v.toLowerCase()] as [string, string]);

  const filteredItems = activeFilters.length > 0 
    ? items.filter(item => matchesAllFilters(item, activeFilters, mapping, getCardFields))
    : items;

  const mappedToSort = filteredItems.map(item => {
    let rawVal;
    if (!mapping && getCardFields) {
      const fields: any = getCardFields(item);
      rawVal = getNestedValue(item, fields[sortField] || sortField);
    } else {
      rawVal = getNestedValue(item, sortField);
    }
    const sortVal = rawVal !== undefined && rawVal !== null ? String(rawVal).toLowerCase() : '';
    return { item, sortVal };
  });

  mappedToSort.sort((a, b) => {
    if (a.sortVal < b.sortVal) return sortDirection === 'asc' ? -1 : 1;
    if (a.sortVal > b.sortVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return mappedToSort.map(obj => obj.item);
};
