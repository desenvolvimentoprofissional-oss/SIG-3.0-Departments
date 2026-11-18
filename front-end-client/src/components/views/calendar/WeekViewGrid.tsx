import React from 'react';
import { CalendarCard } from './CalendarCard';
import { CalendarItem, CalendarCardFields } from '../../../templates/CalendarTemplate';

interface WeekViewGridProps {
  weekDaysForWeekView: Date[];
  weekDays: string[];
  itemsByDate: Record<string, any[]>;
  formatToYYYYMMDD: (date: Date) => string;
  realTodayStr: string;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetDate: string) => void;
  handleDragStart: (e: React.DragEvent, item: any) => void;
  onCardClick?: (id: string, item: CalendarItem) => void;
  getCardFields: (item: CalendarItem) => CalendarCardFields;
  onClearDate?: (item: CalendarItem) => void;
}

export const WeekViewGrid: React.FC<WeekViewGridProps> = ({
  weekDaysForWeekView, weekDays, itemsByDate, formatToYYYYMMDD, realTodayStr,
  handleDragOver, handleDrop, handleDragStart, onCardClick, getCardFields, onClearDate
}) => {
  return (
    <div className="flex-1 min-h-0 grid grid-cols-7 overflow-hidden border-t border-[var(--color-border-default)]">
      {weekDaysForWeekView.map(date => {
        const formattedDate = formatToYYYYMMDD(date);
        const dayItems = itemsByDate[formattedDate] || [];
        const isToday = formattedDate === formatToYYYYMMDD(new Date());

        return (
          <div 
            key={formattedDate}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, formattedDate)}
            className="border-r border-[var(--color-border-default)]/30 p-2 flex flex-col hover:bg-[var(--color-brand-main)]/5 transition-colors overflow-hidden"
          >
            <div className="flex flex-col items-center mb-4 pb-2 border-b border-[var(--color-border-default)]/50">
              <span className="text-xs font-semibold text-[var(--color-content-secondary)] uppercase mb-1">{weekDays[date.getDay()]}</span>
              <span className={`text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full ${isToday ? 'bg-[var(--color-brand-main)] text-white' : 'text-[var(--color-brand-dark)]'}`}>
                {date.getDate()}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar px-1">
              {dayItems.map(item => (
                <CalendarCard
                   key={item._id || item.id}
                   item={item}
                   fields={getCardFields(item)}
                   formattedDate={formattedDate}
                   realTodayStr={realTodayStr}
                   viewMode="week"
                   handleDragStart={handleDragStart}
                   onCardClick={onCardClick}
                   onClearDate={onClearDate}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
