import { logger } from "./logger.util";
import { PageMapping } from '../types/index';
import { useMappingStore } from '../store/mappingStore';

function getStorageKey(deptId: string, userId?: string): string {
  return `sidebar_order_${userId || 'guest'}_${deptId}`;
}

function getCustomOrder(storageKey: string): string[] {
  const customOrders = useMappingStore.getState().userCustomOrders || {};
  return customOrders[storageKey] || [];
}

function sortAlphabetically(mappings: PageMapping[]): PageMapping[] {
  return [...mappings].sort((a, b) => {
    const nameA = (a.pageName || '').trim().toLowerCase();
    const nameB = (b.pageName || '').trim().toLowerCase();
    return nameA.localeCompare(nameB, 'pt-BR', { numeric: true, sensitivity: 'base' });
  });
}

function mergeOrders(alphabetical: PageMapping[], customOrder: string[]): PageMapping[] {
  const customSet = new Set(customOrder);
  const customOrderedItems = customOrder
    .map(id => alphabetical.find(m => m.id === id))
    .filter(Boolean) as PageMapping[];

  const result: PageMapping[] = [];
  let customIndex = 0;

  for (const item of alphabetical) {
    if (customSet.has(item.id)) {
      result.push(customOrderedItems[customIndex++]);
    } else {
      result.push(item);
    }
  }

  return result;
}

export function getSortedMappings(
  mappings: PageMapping[],
  deptId: string,
  userId?: string
): PageMapping[] {
  const storageKey = getStorageKey(deptId, userId);
  const customOrder = getCustomOrder(storageKey);
  const alphabeticalMappings = sortAlphabetically(mappings);

  if (customOrder.length === 0) {
    return alphabeticalMappings;
  }

  return mergeOrders(alphabeticalMappings, customOrder);
}

export function saveSortedMappings(
  mappings: PageMapping[],
  deptId: string,
  userId?: string
) {
  try {
    const storageKey = getStorageKey(deptId, userId);
    const newOrder = mappings.map(item => item.id);
    
    useMappingStore.getState().setCustomOrder(storageKey, newOrder);
    useMappingStore.getState().notifyOrderChange();
  } catch (e) {
    logger.error('SAVE_ORDER_FAILED');
  }
}
