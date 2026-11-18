import React from 'react';

interface SegmentedControlProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function SegmentedControl({ options, value, onChange, className = '' }: SegmentedControlProps) {
  return (
    <div className={`flex w-full bg-[var(--color-border-default)] bg-opacity-30 p-1 rounded-lg ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 px-2 py-1.5 text-[11px] sm:text-xs font-semibold rounded-md transition-all ${
            value === option.value 
              ? 'bg-[var(--color-content-inverse)] text-[var(--color-brand-dark)] shadow-sm' 
              : 'text-[var(--color-content-secondary)] hover:text-[var(--color-brand-dark)]'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}


const _SegmentedControl = React.memo(SegmentedControl);
export { _SegmentedControl as SegmentedControl };
