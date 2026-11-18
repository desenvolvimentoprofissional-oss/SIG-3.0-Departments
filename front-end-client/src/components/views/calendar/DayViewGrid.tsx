import React from 'react';
import { CalendarCard } from './CalendarCard';
import { CalendarItem, CalendarCardFields } from '../../../templates/CalendarTemplate';

interface DayViewGridProps {
  currentDate: Date;
  weekDays: string[];
  monthNames: string[];
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

export const DayViewGrid: React.FC<DayViewGridProps> = ({
  currentDate, weekDays, monthNames, itemsByDate, formatToYYYYMMDD, realTodayStr,
  handleDragOver, handleDrop, handleDragStart, onCardClick, getCardFields, onClearDate
}) => {
  const formattedDate = formatToYYYYMMDD(currentDate);
  const dayItems = itemsByDate[formattedDate] || [];
  
  return (
    <div className="flex-1 flex flex-col border-t border-[var(--color-border-default)] bg-[var(--color-background-light)]/30 overflow-hidden">
      <div 
        className="flex-1 p-6 flex flex-col overflow-y-auto"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, formattedDate)}
      >
        <div className="flex flex-col mb-6 pb-4 border-b border-[var(--color-border-default)]">
          <span className="text-sm font-semibold text-[var(--color-content-secondary)] uppercase mb-1">{weekDays[currentDate.getDay()]}</span>
          <div className="flex items-center gap-3">
            <span className={`text-4xl font-bold w-16 h-16 flex items-center justify-center rounded-full ${formattedDate === realTodayStr ? 'bg-[var(--color-brand-main)] text-white' : 'text-[var(--color-brand-dark)]'}`}>
              {currentDate.getDate()}
            </span>
            <span className="text-2xl font-medium text-[var(--color-content-primary)]">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dayItems.length === 0 ? (
            <div className="col-span-full py-12 text-center text-sm font-medium text-[var(--color-content-secondary)]">Sem itens para e este dia</div>
          ) : (
            dayItems.map(item => (
              <CalendarCard
                 key={item._id || item.id}
                 item={item}
                 fields={getCardFields(item)}
                 formattedDate={formattedDate}
                 realTodayStr={realTodayStr}
                 viewMode="day"
                 handleDragStart={handleDragStart}
                 onCardClick={onCardClick}
                 onClearDate={onClearDate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
