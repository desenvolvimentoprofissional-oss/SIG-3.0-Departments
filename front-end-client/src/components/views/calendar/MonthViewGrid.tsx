import React from 'react';
import { Maximize2 } from 'lucide-react';
import { CalendarCard } from './CalendarCard';
import { CalendarItem, CalendarCardFields } from '../../../templates/CalendarTemplate';

interface MonthViewGridProps {
  paddingDays: number[];
  daysInMonth: Date[];
  itemsByDate: Record<string, any[]>;
  formatToYYYYMMDD: (date: Date) => string;
  realTodayStr: string;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetDate: string) => void;
  handleDragStart: (e: React.DragEvent, item: any) => void;
  onCardClick?: (id: string, item: CalendarItem) => void;
  getCardFields: (item: CalendarItem) => CalendarCardFields;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  setViewMode: React.Dispatch<React.SetStateAction<"month" | "week" | "day">>;
  onClearDate?: (item: CalendarItem) => void;
}

export const MonthViewGrid: React.FC<MonthViewGridProps> = ({
  paddingDays, daysInMonth, itemsByDate, formatToYYYYMMDD, realTodayStr,
  handleDragOver, handleDrop, handleDragStart, onCardClick, getCardFields,
  setCurrentDate, setViewMode, onClearDate
}) => {
  const totalDays = paddingDays.length + daysInMonth.length;
  const weeksCount = Math.ceil(totalDays / 7);

  return (
    <div 
       className="grid grid-cols-7 flex-1"
       style={{ gridTemplateRows: `repeat(${weeksCount}, minmax(120px, auto))` }}
    >
      {paddingDays.map(i => (
        <div key={`padding-${i}`} className="border-r border-b border-[var(--color-border-default)]/30 bg-gray-50/50 min-h-[120px]"></div>
      ))}

      {daysInMonth.map(date => {
        const formattedDate = formatToYYYYMMDD(date);
        const dayItems = itemsByDate[formattedDate] || [];
        const isToday = formattedDate === formatToYYYYMMDD(new Date());

        return (
          <div 
            key={formattedDate}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, formattedDate)}
            className="border-r border-b border-[var(--color-border-default)]/30 min-h-[120px] p-2 flex flex-col hover:bg-[var(--color-brand-main)]/5 transition-colors overflow-hidden"
          >
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-[var(--color-brand-main)] text-white' : 'text-[var(--color-content-secondary)]'}`}>
                {date.getDate()}
              </span>
              {dayItems.length > 0 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentDate(date);
                    setViewMode('week');
                  }}
                  className="text-[10px] bg-[var(--color-background-light)] px-1.5 py-0.5 rounded text-[var(--color-content-tertiary)] hover:bg-[var(--color-brand-main)]/10 hover:text-[var(--color-brand-main)] font-medium inline-flex items-center gap-1 transition-colors group"
                  title="Expandir para Visão Semanal"
                >
                  <span>{dayItems.length} proc.</span>
                  <Maximize2 size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
              {dayItems.map(item => (
                <CalendarCard
                   key={item._id || item.id}
                   item={item}
                   fields={getCardFields(item)}
                   formattedDate={formattedDate}
                   realTodayStr={realTodayStr}
                   viewMode="month"
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
