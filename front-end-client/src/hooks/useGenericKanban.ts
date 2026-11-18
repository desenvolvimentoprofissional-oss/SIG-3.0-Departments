import { useState, useEffect, useMemo } from 'react';
import { KanbanItem, KanbanCardFields } from '../templates/KanbanTemplate';

export const useGenericKanban = (
  items: KanbanItem[],
  getCardFields: (item: KanbanItem) => KanbanCardFields,
  defaultColumns: string[]
) => {
  const [collapsedCols, setCollapsedCols] = useState<Set<string>>(new Set());
  const [customColumns, setCustomColumns] = useState<string[]>([]);
  const [cardCustomCols, setCardCustomCols] = useState<Record<string, string>>({});
  const [isAddingCol, setIsAddingCol] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  const toggleCollapse = (colName: string) => {
    const next = new Set(collapsedCols);
    if (next.has(colName)) next.delete(colName);
    else next.add(colName);
    setCollapsedCols(next);
  };

  const kanbanColumns = useMemo(() => {
    const cols = new Map<string, KanbanItem[]>();
    
    defaultColumns.forEach(c => cols.set(c, []));
    
    customColumns.forEach(c => cols.set(c, []));

    items.forEach(item => {
       const fields = getCardFields(item);
       let originalColName = 'Sem Status';
       
       if (fields.kanbanColumnField && item[fields.kanbanColumnField]) {
         originalColName = String(item[fields.kanbanColumnField]);
       } else if (fields.status && item[fields.status]) {
         originalColName = String(item[fields.status]);
       }

       const assignedCol = cardCustomCols[item.id];
       let finalColName = originalColName;
       if (assignedCol && customColumns.includes(assignedCol)) {
          finalColName = assignedCol;
       }
       
       if (!cols.has(finalColName)) cols.set(finalColName, []);
       cols.get(finalColName)!.push(item);
    });
    
    return cols;
  }, [items, getCardFields, defaultColumns, customColumns, cardCustomCols]);

  useEffect(() => {
    setColumnOrder(prev => {
      const currentCols = Array.from(kanbanColumns.keys());
      const missing = currentCols.filter(c => !prev.includes(c));
      let nextOrder = [...prev];
      if (prev.length === 0) {
        nextOrder = [...currentCols].sort();
        nextOrder.push('__ADD_COLUMN__');
      } else {
        if (missing.length > 0) {
          const addIdx = nextOrder.indexOf('__ADD_COLUMN__');
          if (addIdx > -1) {
            nextOrder.splice(addIdx, 0, ...missing);
          } else {
            nextOrder.push(...missing, '__ADD_COLUMN__');
          }
        }
        if (!nextOrder.includes('__ADD_COLUMN__')) {
            nextOrder.push('__ADD_COLUMN__');
        }
      }
      return nextOrder;
    });
  }, [kanbanColumns]);

  const handleDragStart = (e: React.DragEvent, type: 'item' | 'column', id: string, sourceCol?: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type, id, sourceCol }));
  };

  const handleDrop = (e: React.DragEvent, targetCol: string) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { type, id } = data;
      
      if (type === 'item') {
        const itemId = id;
        if (customColumns.includes(targetCol)) {
          setCardCustomCols(prev => ({ ...prev, [itemId]: targetCol }));
        } else {
          setCardCustomCols(prev => {
            const next = { ...prev };
            delete next[itemId];
            return next;
          });
        }
      } else if (type === 'column') {
        const draggedCol = id;
        if (draggedCol === targetCol) return;
        setColumnOrder(prev => {
          const arr = [...prev];
          const draggedIdx = arr.indexOf(draggedCol);
          const targetIdx = arr.indexOf(targetCol);
          if (draggedIdx > -1 && targetIdx > -1) {
            arr.splice(draggedIdx, 1);
            arr.splice(targetIdx, 0, draggedCol);
          }
          return arr;
        });
      }
    } catch(err) {
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDeleteCustomCol = (e: React.MouseEvent, colName: string) => {
    e.stopPropagation();
    setCustomColumns(prev => prev.filter(c => c !== colName));
    setCardCustomCols(prev => {
      const next = {...prev};
      Object.keys(next).forEach(k => {
          if (next[k] === colName) delete next[k];
      });
      return next;
    });
  };

  return {
    collapsedCols, customColumns, cardCustomCols, setCardCustomCols, setCustomColumns,
    isAddingCol, setIsAddingCol, newColName, setNewColName, columnOrder,
    kanbanColumns, toggleCollapse, handleDragStart, handleDrop,
    handleDragOver, handleDeleteCustomCol
  };
};
