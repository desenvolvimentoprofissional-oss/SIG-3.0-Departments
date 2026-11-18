import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Lock } from 'lucide-react';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: { label: string; value: string; hidden?: boolean; disabled?: boolean; icon?: React.ReactNode }[];
  custom?: boolean;
};

function Select({ options, className = '', disabled, value, onChange, custom, ...props }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = React.useId();

  const isCustom = custom || options.some(o => (!o.hidden && o.disabled) || o.icon);
  const selectedOption = options.find(o => String(o.value) === String(value ?? ''));
  const isPlaceholder = !value || value === '' || selectedOption?.hidden;
  const displayLabel = selectedOption ? selectedOption.label : (options.find(o => !o.hidden)?.label || 'Select');

  useEffect(() => {
    if (!isCustom) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCustom]);

  const handleSelect = (option: { label: string; value: string; disabled?: boolean }) => {
    if (option.disabled || disabled) return;
    setIsOpen(false);
    if (onChange) {
      const event = {
        target: { value: option.value, name: props.name },
        currentTarget: { value: option.value, name: props.name }
      } as unknown as React.ChangeEvent<HTMLSelectElement>;
      onChange(event);
    }
  };

  if (isCustom) {
    return (
      <div ref={containerRef} className={`relative w-full ${disabled ? 'opacity-60' : ''}`}>
        <select 
          disabled={disabled}
          value={value}
          onChange={onChange}
          className="hidden"
          {...props}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value} hidden={option.hidden} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-label={props['aria-label'] || props.title || "Select an option"}
          className={`w-full bg-white border border-[var(--color-border-default)] ${isPlaceholder ? 'text-[var(--color-content-tertiary)]' : 'text-[var(--color-content-primary)]'} text-sm rounded-lg pl-3 pr-9 h-[38px] flex items-center justify-between text-left focus:outline-none focus:border-[var(--color-brand-main)] focus:ring-1 focus:ring-[var(--color-brand-main)] transition-colors shadow-sm ${disabled ? 'cursor-not-allowed bg-slate-50' : 'cursor-pointer'} ${className}`}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-content-tertiary)] w-4 h-4 pointer-events-none transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && !disabled && (
          <div 
            id={listboxId}
            role="listbox"
            aria-label="Opções"
            className="absolute z-[999] left-0 right-0 mt-1 bg-white border border-[var(--color-border-default)] rounded-lg shadow-lg max-h-[500px] overflow-y-auto py-1 animate-in fade-in-0 zoom-in-95 duration-100"
          >
            {options
              .filter(option => !option.hidden)
              .map((option, index) => {
                const isSelected = String(option.value) === String(value ?? '');
                return (
                  <button
                    type="button"
                    key={index}
                    role="option"
                    aria-selected={isSelected}
                    disabled={option.disabled}
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left border-0 px-3 py-2.5 text-sm flex items-center justify-between transition-colors ${
                      option.disabled
                        ? 'text-slate-400 bg-transparent hover:bg-slate-100 cursor-not-allowed select-none'
                        : isSelected
                        ? 'bg-[var(--color-brand-main)]/10 text-[var(--color-brand-main)] font-medium cursor-pointer hover:bg-[var(--color-brand-main)]/15'
                        : 'text-[var(--color-content-primary)] hover:bg-slate-50 cursor-pointer'
                    }`}
                    title={option.disabled ? 'This page type already exists in this department (only 1 per department)' : undefined}
                  >
                    <span className="truncate">{option.label}</span>
                    {option.disabled ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 shrink-0 ml-2">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      </span>
                    ) : option.icon ? (
                      <span className="ml-2 shrink-0">{option.icon}</span>
                    ) : null}
                  </button>
                );
              })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full ${disabled ? 'opacity-60' : ''}`}>
      <select 
        disabled={disabled}
        value={value}
        onChange={onChange}
        className={`w-full bg-white border border-[var(--color-border-default)] text-[var(--color-content-primary)] text-sm rounded-lg pl-3 pr-9 h-[38px] appearance-none focus:outline-none focus:border-[var(--color-brand-main)] focus:ring-0 transition-colors shadow-sm ${disabled ? 'cursor-not-allowed' : ''} ${className}`}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value} hidden={option.hidden} disabled={option.disabled} className={option.hidden ? 'hidden' : ''} style={option.hidden ? { display: 'none' } : undefined}>{option.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-content-tertiary)] w-4 h-4 pointer-events-none" />
    </div>
  );
}

const _Select = React.memo(Select);
export { _Select as Select };
