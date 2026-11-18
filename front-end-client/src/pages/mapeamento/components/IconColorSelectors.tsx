import React, { useState, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { ChevronDown } from 'lucide-react';

export const ICON_OPTIONS = [
  { label: 'Padrão', value: 'LayoutTemplate' },
  { label: 'Usuários', value: 'Users' },
  { label: 'Documentação', value: 'FileText' },
  { label: 'Check', value: 'CheckCircle' },
  { label: 'Alerta', value: 'AlertTriangle' },
  { label: 'Gráfico', value: 'BarChart' },
  { label: 'Dinheiro', value: 'DollarSign' },
  { label: 'Estrela', value: 'Star' },
  { label: 'Maleta', value: 'Briefcase' },
  { label: 'Tempo', value: 'Clock' },
  { label: 'Ampulheta', value: 'Hourglass' },
  { label: 'Calendário', value: 'CalendarClock' },
  { label: 'Arquivado', value: 'Archive' },
  { label: 'Bloqueado', value: 'Lock' },
  { label: 'Proibido', value: 'Ban' },
  { label: 'Em Andamento', value: 'Activity' },
  { label: 'Registros', value: 'Database' },
  { label: 'Lista', value: 'ListChecks' },
  { label: 'Área de Transferência', value: 'ClipboardList' },
  { label: 'Meta', value: 'Target' },
  { label: 'Evolução', value: 'TrendingUp' },
  { label: 'Destaque', value: 'Zap' },
  { label: 'Conquista', value: 'Award' }
];

export const COLOR_OPTIONS = [

  { label: 'Brand Light', value: '#E7FAFF' },
  { label: 'Secondary Light', value: '#B9D9FF' },
  { label: 'Info', value: '#3b82f6' },
  { label: 'Secondary Main', value: '#5D97F5' },
  { label: 'Brand Main', value: '#0043A2' },
  { label: 'Secondary Dark', value: '#2259B2' },
  { label: 'Brand Dark', value: '#051126' },

  { label: 'Accent Light', value: '#FFD230' },
  { label: 'Accent Main', value: '#FFB900' },
  { label: 'Aviso', value: '#f59e0b' },
  { label: 'Accent Dark', value: '#FE9A00' },

  { label: 'Erro', value: '#e11d48' },

  { label: 'Sucesso', value: '#10b981' },

  { label: 'Content Tertiary', value: '#90A1B9' },
  { label: 'Content Secondary', value: '#45556C' },
  { label: 'Content Primary', value: '#1D293D' },
];

export const IconSelector = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = ICON_OPTIONS.find(o => o.value === value) || ICON_OPTIONS[0];
  const SelectedIcon = (LucideIcons as any)[selectedOption.value] || LucideIcons.LayoutTemplate;

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-[var(--color-border-default)] text-[var(--color-content-primary)] rounded-lg py-2 focus:outline-none focus:border-[var(--color-brand-main)] focus:ring-0  transition-colors shadow-sm flex items-center justify-center relative h-10"
      >
        <SelectedIcon className="w-5 h-5" />
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-content-tertiary)] w-4 h-4 pointer-events-none" />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-[var(--color-border-default)] rounded-lg shadow-lg p-2 flex flex-wrap gap-2 justify-center">
          {ICON_OPTIONS.map(option => {
            const IconComponent = (LucideIcons as any)[option.value] || LucideIcons.LayoutTemplate;
            return (
              <button
                key={option.value}
                title={option.label}
                className="p-2 flex items-center justify-center cursor-pointer hover:bg-[var(--color-background-soft)] rounded-md transition-colors"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                type="button">
                <IconComponent className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const ColorSelector = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = COLOR_OPTIONS.find(o => o.value === value) || COLOR_OPTIONS[0];

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-[var(--color-border-default)] text-[var(--color-content-primary)] rounded-lg py-2 focus:outline-none focus:border-[var(--color-brand-main)] focus:ring-0  transition-colors shadow-sm flex items-center justify-center relative h-10"
      >
        <div className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: selectedOption.value }} />
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-content-tertiary)] w-4 h-4 pointer-events-none" />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-[var(--color-border-default)] rounded-lg shadow-lg p-2 flex flex-wrap gap-2 justify-center">
          {COLOR_OPTIONS.map(option => (
            <button
              key={option.value}
              title={option.label}
              className="p-2 flex items-center justify-center cursor-pointer hover:bg-[var(--color-background-soft)] rounded-md transition-colors"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              type="button">
              <div className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0" style={{ backgroundColor: option.value }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
