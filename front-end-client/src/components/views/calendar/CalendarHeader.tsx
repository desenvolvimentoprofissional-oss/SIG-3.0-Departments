import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  viewMode: 'month' | 'week' | 'day';
  currentDate: Date;
  monthNames: string[];
  weekDaysForWeekView: Date[];
  setViewMode: (mode: 'month' | 'week' | 'day') => void;
  setCurrentDate: (date: Date) => void;
  handlePrev: () => void;
  handleNext: () => void;
  totals?: { vencidos: number, hoje: number, aVencer: number };
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  viewMode, currentDate, monthNames, weekDaysForWeekView,
  setViewMode, setCurrentDate, handlePrev, handleNext, totals
}) => {
  return (
    <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--color-border-default)] bg-[var(--color-background-light)] rounded-t-xl">
      <div className="flex items-center gap-4 flex-wrap">
        <h2 className="text-lg font-bold text-[var(--color-content-primary)] min-w-[200px] tracking-tight">
          {viewMode === 'month' 
            ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
            : viewMode === 'week'
            ? `Semana de ${weekDaysForWeekView[0].getDate()} a ${weekDaysForWeekView[6].getDate()} de ${monthNames[weekDaysForWeekView[6].getMonth()]}`
            : `${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
          }
        </h2>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          {totals && (
            <div className="flex items-center space-x-2 mr-4">
               <div className="flex flex-col items-center justify-center px-3 py-1.5 bg-white border border-red-200 rounded-md shadow-sm min-w-[70px]">
                 <span className="text-red-600 font-bold leading-none text-sm">{totals.vencidos}</span>
                 <span className="text-[9px] font-medium uppercase tracking-wider text-red-500/80 mt-0.5">Vencidos</span>
               </div>
               <div className="flex flex-col items-center justify-center px-3 py-1.5 bg-white border border-orange-200 rounded-md shadow-sm min-w-[70px]">
                 <span className="text-orange-500 font-bold leading-none text-sm">{totals.hoje}</span>
                 <span className="text-[9px] font-medium uppercase tracking-wider text-orange-500/80 mt-0.5">Hoje</span>
               </div>
               <div className="flex flex-col items-center justify-center px-3 py-1.5 bg-white border border-green-200 rounded-md shadow-sm min-w-[70px]">
                 <span className="text-green-600 font-bold leading-none text-sm">{totals.aVencer}</span>
                 <span className="text-[9px] font-medium uppercase tracking-wider text-green-600/80 mt-0.5">A Vencer</span>
               </div>
            </div>
          )}
          <button 
             onClick={() => setCurrentDate(new Date())}
             className="px-4 py-1.5 text-xs font-semibold rounded-md border border-[var(--color-border-default)] bg-white text-[var(--color-content-secondary)] hover:text-[var(--color-brand-main)] hover:border-[var(--color-brand-main)]/30 transition-all shadow-sm"
             type="button">
             Hoje
          </button>
        </div>
        <div className="flex items-center bg-[var(--color-background-main)] p-0.5 rounded-md border border-[var(--color-border-default)]">
            <button 
               onClick={() => setViewMode('day')}
               className={`px-3 py-1.5 text-xs font-semibold rounded ${viewMode === 'day' ? 'bg-white text-[var(--color-brand-main)] shadow-sm' : 'text-[var(--color-content-secondary)] hover:text-[var(--color-brand-main)]'} transition-colors`}
               type="button">
               Dia
            </button>
            <button 
               onClick={() => setViewMode('week')}
               className={`px-3 py-1.5 text-xs font-semibold rounded ${viewMode === 'week' ? 'bg-white text-[var(--color-brand-main)] shadow-sm' : 'text-[var(--color-content-secondary)] hover:text-[var(--color-brand-main)]'} transition-colors`}
               type="button">
               Semana
            </button>
            <button 
               onClick={() => setViewMode('month')}
               className={`px-3 py-1.5 text-xs font-semibold rounded ${viewMode === 'month' ? 'bg-white text-[var(--color-brand-main)] shadow-sm' : 'text-[var(--color-content-secondary)] hover:text-[var(--color-brand-main)]'} transition-colors`}
               type="button">
               Mês
            </button>
        </div>
        <div className="flex space-x-1">
          <button 
            className="p-1.5 rounded-md hover:bg-[var(--color-border-default)]/50 transition-colors text-[var(--color-content-secondary)] hover:text-[var(--color-brand-main)]" 
            onClick={handlePrev}
            type="button"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            className="p-1.5 rounded-md hover:bg-[var(--color-border-default)]/50 transition-colors text-[var(--color-content-secondary)] hover:text-[var(--color-brand-main)]" 
            onClick={handleNext}
            type="button"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
