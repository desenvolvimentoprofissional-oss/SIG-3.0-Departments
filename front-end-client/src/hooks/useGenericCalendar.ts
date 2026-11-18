import { useState, useMemo, useEffect, useRef } from 'react';
import { CalendarItem, CalendarCardFields } from '../templates/CalendarTemplate';
import { getNestedValue } from '../templates/partials/DataGridRow';

const formatToYYYYMMDD = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const useGenericCalendar = (
  items: CalendarItem[],
  getCardFields: (item: CalendarItem) => CalendarCardFields,
  onDateChange?: (item: CalendarItem, newDate: string) => void
) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [itemsByDate, setItemsByDate] = useState<Record<string, any[]>>({});
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/semantic-parser.worker.ts', import.meta.url), {
      type: 'module'
    });
    
    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'CALENDAR_RESULT') setItemsByDate(e.data.payload);
    };
    
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (!workerRef.current) return;

    const itemsForWorker = items.map(item => {
      const fields = getCardFields(item);
      const rawDate = fields.dateField ? getNestedValue(item, fields.dateField) : null;
      return {
        ...item,
        _computedDateField: rawDate || null
      };
    });
    
    workerRef.current.postMessage({ type: 'PARSE_CALENDAR', payload: { items: itemsForWorker } });
  }, [items, getCardFields]);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentDate]);

  const weekDaysForWeekView = useMemo(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(date.getDate() - day);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(firstDayOfWeek);
        d.setDate(firstDayOfWeek.getDate() + i);
        days.push(d);
    }
    return days;
  }, [currentDate]);

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const paddingDays = Array.from({ length: firstDayOfMonth }).map((_, i) => i);

  const handlePrev = () => {
    if (viewMode === 'month') {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (viewMode === 'week') {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7));
    } else {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (viewMode === 'week') {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7));
    } else {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1));
    }
  };

  const handleDragStart = (e: React.DragEvent, item: any) => {
    const id = item._id || item.id;
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    const item = items.find(i => (i._id || i.id) === itemId);
    if (item && onDateChange) {
      onDateChange(item, targetDate);
    }
  };

  return {
    currentDate, setCurrentDate, viewMode, setViewMode, daysInMonth, weekDaysForWeekView,
    paddingDays, handlePrev, handleNext, handleDragStart, handleDragOver, handleDrop,
    itemsByDate, formatToYYYYMMDD
  };
};
