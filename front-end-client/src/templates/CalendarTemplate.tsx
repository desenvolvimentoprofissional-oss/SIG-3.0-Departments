import React from 'react';
import { CalendarHeader } from '../components/views/calendar/CalendarHeader';
import { MonthViewGrid } from '../components/views/calendar/MonthViewGrid';
import { WeekViewGrid } from '../components/views/calendar/WeekViewGrid';
import { DayViewGrid } from '../components/views/calendar/DayViewGrid';
import { UncategorizedPanel } from '../components/views/calendar/UncategorizedPanel';
import { useGenericCalendar } from '../hooks/useGenericCalendar';
import { getNestedValue } from './partials/DataGridRow';

export interface CalendarItem {
  id: string;
  [key: string]: any;
}

export interface CalendarCardFields {
  status: string;
  processNumber: string;
  name?: string | null;
  cpfCnpj?: string;
  createdAt?: string;
  tagField?: string | null;
  priorityField?: string | null;
  dateField?: string | null;
}

export interface CalendarTemplateProps {
  items: CalendarItem[];
  getCardFields: (item: CalendarItem) => CalendarCardFields;
  onCardClick?: (id: string, item: CalendarItem) => void;
  onDateChange?: (item: CalendarItem, newDate: string) => void;
  isLoading?: boolean;
}

export const CalendarTemplate: React.FC<CalendarTemplateProps> = ({ 
  items, 
  getCardFields, 
  onCardClick,
  onDateChange,
  isLoading
}) => {
  const {
    currentDate, setCurrentDate, viewMode, setViewMode, daysInMonth, weekDaysForWeekView,
    paddingDays, handlePrev, handleNext, handleDragStart, handleDragOver, handleDrop,
    itemsByDate, formatToYYYYMMDD
  } = useGenericCalendar(items, getCardFields, onDateChange);

  const handleClearDate = (item: CalendarItem) => {
    if (onDateChange) {
      onDateChange(item, '');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-main"></div>
      </div>
    );
  }

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const realTodayStr = formatToYYYYMMDD(new Date());

  const totals = { vencidos: 0, hoje: 0, aVencer: 0 };
  items.forEach(item => {
    const fields = getCardFields(item);
    const dateVal = fields.dateField ? getNestedValue(item, fields.dateField) : null;
    if (!dateVal) return;
    const dateObj = new Date(dateVal);
    if (isNaN(dateObj.getTime())) return;
    const dStr = formatToYYYYMMDD(dateObj);
    if (dStr < realTodayStr) totals.vencidos++;
    else if (dStr === realTodayStr) totals.hoje++;
    else totals.aVencer++;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border-default)] overflow-hidden flex flex-col h-full w-full">
      {}
        <CalendarHeader
          viewMode={viewMode}
          currentDate={currentDate}
          monthNames={monthNames}
          weekDaysForWeekView={weekDaysForWeekView}
          setViewMode={setViewMode}
          setCurrentDate={setCurrentDate}
          handlePrev={handlePrev}
          handleNext={handleNext}
          totals={totals}
        />

        {}
        {viewMode === 'month' && (
          <div className="grid grid-cols-7 border-b border-[var(--color-border-default)] bg-gray-50">
            {weekDays.map(day => (
              <div key={day} className="py-2.5 text-center text-[10px] font-bold text-[var(--color-content-tertiary)] uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
        )}

        {}
        <div className="flex-1 overflow-auto hidden-scrollbar flex flex-col relative w-full h-full min-h-0">
          {viewMode === 'month' ? (
            <MonthViewGrid
              paddingDays={paddingDays}
              daysInMonth={daysInMonth}
              itemsByDate={itemsByDate}
              formatToYYYYMMDD={formatToYYYYMMDD}
              realTodayStr={realTodayStr}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleDragStart={handleDragStart}
              onCardClick={onCardClick}
              getCardFields={getCardFields}
              setCurrentDate={setCurrentDate}
              setViewMode={setViewMode}
              onClearDate={handleClearDate}
            />
          ) : viewMode === 'week' ? (
            <WeekViewGrid
              weekDaysForWeekView={weekDaysForWeekView}
              weekDays={weekDays}
              itemsByDate={itemsByDate}
              formatToYYYYMMDD={formatToYYYYMMDD}
              realTodayStr={realTodayStr}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleDragStart={handleDragStart}
              onCardClick={onCardClick}
              getCardFields={getCardFields}
              onClearDate={handleClearDate}
            />
          ) : (
            <DayViewGrid
              currentDate={currentDate}
              weekDays={weekDays}
              monthNames={monthNames}
              itemsByDate={itemsByDate}
              formatToYYYYMMDD={formatToYYYYMMDD}
              realTodayStr={realTodayStr}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleDragStart={handleDragStart}
              onCardClick={onCardClick}
              getCardFields={getCardFields}
              onClearDate={handleClearDate}
            />
          )}
        </div>
    </div>
  );
};

