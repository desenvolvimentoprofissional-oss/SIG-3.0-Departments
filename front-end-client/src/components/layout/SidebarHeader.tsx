import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div className="h-14 flex items-center shrink-0 border-b border-[var(--color-border-default)] select-none relative group/sidebarHead">
      <div className="min-w-16 w-16 flex items-center justify-center shrink-0 relative">
        <div className={`w-8 h-8 flex items-center justify-center overflow-hidden transition-opacity duration-300 ${!isSidebarOpen ? 'group-hover/sidebarHead:opacity-0' : ''}`}>
          <img src="/crasp-logo.png" alt="CRA-SP Logo" className="h-8 w-auto object-contain" />
        </div>
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute inset-0 m-auto w-8 h-8 flex items-center justify-center rounded-md text-[var(--color-content-tertiary)] hover:text-[var(--color-brand-main)] hover:bg-[var(--color-brand-main)]/10 focus:outline-none cursor-pointer opacity-0 group-hover/sidebarHead:opacity-100 transition-all duration-300 z-10"
            title="Expandir Menu"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        )}
      </div>
      {isSidebarOpen && (
        <div className="flex flex-col justify-center overflow-hidden pr-2 whitespace-nowrap opacity-100 transition-opacity duration-300 flex-1">
          <span className="font-bold tracking-tight text-[15px] text-[var(--color-brand-dark)] leading-none">SIG</span>
          <span className="text-[10px] text-[var(--color-content-tertiary)] font-medium uppercase mt-0.5 tracking-wider">DEPARTAMENTOS</span>
        </div>
      )}
      
      {isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="w-8 h-8 mr-3 flex items-center justify-center rounded-md text-[var(--color-content-tertiary)] hover:text-[var(--color-brand-main)] hover:bg-[var(--color-brand-main)]/10 focus:outline-none cursor-pointer transition-colors"
          title="Recolher Menu"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>
      )}
      
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none opacity-0 group-hover/sidebarHead:pointer-events-none"
          title="Expandir Menu"
        />
      )}
    </div>
  );
};
