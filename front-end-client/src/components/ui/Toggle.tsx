import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

function Toggle({ checked, onChange, className = '', disabled = false }: ToggleProps) {
  return (
    <button 
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`w-10 h-6 flex items-center flex-shrink-0 rounded-full p-1 transition-colors duration-300 ease-in-out ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${checked ? 'bg-[var(--color-status-success)]' : 'bg-gray-300 border border-[var(--color-border-default)]'} ${className}`}
    >
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`}></div>
    </button>
  );
}


const _Toggle = React.memo(Toggle);
export { _Toggle as Toggle };
