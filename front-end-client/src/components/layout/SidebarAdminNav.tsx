import React from 'react';
import { AppWindow, Images, Building2, Palette, Database, ShieldCheck, Activity } from 'lucide-react';
import { UserSessionProfile } from '../../types/index';

interface SidebarAdminNavProps {
  user: UserSessionProfile | null;
  isSidebarOpen: boolean;
  currentView: string;
  setCurrentView: (v: string) => void;
  handleMouseEnter: (e: React.MouseEvent, text: string) => void;
  handleMouseLeave: () => void;
}

export const SidebarAdminNav: React.FC<SidebarAdminNavProps> = ({
  user,
  isSidebarOpen,
  currentView,
  setCurrentView,
  handleMouseEnter,
  handleMouseLeave
}) => {
  return (
    <>
      <div className={`py-4 ${isSidebarOpen ? 'px-7' : 'px-0 text-center'}`}>
        <div className={`h-px w-full bg-[var(--color-border-default)] ${!isSidebarOpen && 'w-6 mx-auto'}`}></div>
      </div>
      <div className="flex flex-col space-y-1">
        <div className={`mb-2 flex items-center min-h-[15px] ${isSidebarOpen ? 'px-7' : 'px-0 justify-center'}`}>
          {isSidebarOpen && <span className="text-[10px] font-semibold text-[var(--color-content-tertiary)] uppercase tracking-wider leading-none">SIG.Admin</span>}
        </div>
        
        <button 
          onClick={() => setCurrentView('avisos')}
          onMouseEnter={(e) => handleMouseEnter(e, 'Avisos')}
          onMouseLeave={handleMouseLeave}
          className={`flex items-center h-8 rounded-md group transition-all duration-300 ease-in-out overflow-hidden focus:outline-none ${
            isSidebarOpen ? 'mx-4 px-3 w-[calc(100%-32px)]' : 'ml-4 w-8 px-0 justify-center'
          } ${
            currentView === 'avisos' 
              ? 'bg-[var(--color-brand-main)]/10 text-[var(--color-brand-main)]' 
              : 'bg-transparent text-[var(--color-content-secondary)] hover:bg-[var(--color-border-default)]/50 hover:text-[var(--color-brand-dark)]'
          }`}
        >
          <AppWindow className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${currentView === 'avisos' ? 'text-[var(--color-brand-main)]' : 'text-[var(--color-content-secondary)] group-hover:text-[var(--color-brand-dark)]'}`} size={18} strokeWidth={1.625} />
          {isSidebarOpen && <span className="text-[13px] font-normal whitespace-nowrap ml-3">Avisos</span>}
        </button>

        <button 
          onClick={() => setCurrentView('banners')}
          onMouseEnter={(e) => handleMouseEnter(e, 'Banners')}
          onMouseLeave={handleMouseLeave}
          className={`flex items-center h-8 rounded-md group transition-all duration-300 ease-in-out overflow-hidden focus:outline-none ${
            isSidebarOpen ? 'mx-4 px-3 w-[calc(100%-32px)]' : 'ml-4 w-8 px-0 justify-center'
          } ${
            currentView === 'banners' 
              ? 'bg-[var(--color-brand-main)]/10 text-[var(--color-brand-main)]' 
              : 'bg-transparent text-[var(--color-content-secondary)] hover:bg-[var(--color-border-default)]/50 hover:text-[var(--color-brand-dark)]'
          }`}
        >
          <Images className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${currentView === 'banners' ? 'text-[var(--color-brand-main)]' : 'text-[var(--color-content-secondary)] group-hover:text-[var(--color-brand-dark)]'}`} size={18} strokeWidth={1.625} />
          {isSidebarOpen && <span className="text-[13px] font-normal whitespace-nowrap ml-3">Banners</span>}
        </button>

        {(user?.role === 'MASTER' || user?.role === 'ADMIN') && (
          <button 
            onClick={() => setCurrentView('departamentosAdmin')}
            onMouseEnter={(e) => handleMouseEnter(e, 'Departamentos')}
            onMouseLeave={handleMouseLeave}
            className={`flex items-center h-8 rounded-md group transition-all duration-300 ease-in-out overflow-hidden focus:outline-none ${
              isSidebarOpen ? 'mx-4 px-3 w-[calc(100%-32px)]' : 'ml-4 w-8 px-0 justify-center'
            } ${
              currentView === 'departamentosAdmin' 
                ? 'bg-[var(--color-brand-main)]/10 text-[var(--color-brand-main)]' 
                : 'bg-transparent text-[var(--color-content-secondary)] hover:bg-[var(--color-border-default)]/50 hover:text-[var(--color-brand-dark)]'
            }`}
          >
            <Building2 className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${currentView === 'departamentosAdmin' ? 'text-[var(--color-brand-main)]' : 'text-[var(--color-content-secondary)] group-hover:text-[var(--color-brand-dark)]'}`} size={18} strokeWidth={1.625} />
            {isSidebarOpen && <span className="text-[13px] font-normal whitespace-nowrap ml-3">Departamentos</span>}
          </button>
        )}

        {(user?.role === 'MASTER' || user?.role === 'ADMIN') && (
          <button 
            onClick={() => setCurrentView('visaoGeral')}
            onMouseEnter={(e) => handleMouseEnter(e, 'Visão Geral (Teste)')}
            onMouseLeave={handleMouseLeave}
            className={`flex items-center h-8 rounded-md group transition-all duration-300 ease-in-out overflow-hidden focus:outline-none ${
              isSidebarOpen ? 'mx-4 px-3 w-[calc(100%-32px)]' : 'ml-4 w-8 px-0 justify-center'
            } ${
              currentView === 'visaoGeral' 
                ? 'bg-[var(--color-brand-main)]/10 text-[var(--color-brand-main)]' 
                : 'bg-transparent text-[var(--color-content-secondary)] hover:bg-[var(--color-border-default)]/50 hover:text-[var(--color-brand-dark)]'
            }`}
          >
            <Activity className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${currentView === 'visaoGeral' ? 'text-[var(--color-brand-main)]' : 'text-[var(--color-content-secondary)] group-hover:text-[var(--color-brand-dark)]'}`} size={18} strokeWidth={1.625} />
            {isSidebarOpen && <span className="text-[13px] font-normal whitespace-nowrap ml-3">Visão Geral (Teste)</span>}
          </button>
        )}

        <button 
          onClick={() => setCurrentView('style')}
          onMouseEnter={(e) => handleMouseEnter(e, 'Estilos')}
          onMouseLeave={handleMouseLeave}
          className={`flex items-center h-8 rounded-md group transition-all duration-300 ease-in-out overflow-hidden focus:outline-none ${
            isSidebarOpen ? 'mx-4 px-3 w-[calc(100%-32px)]' : 'ml-4 w-8 px-0 justify-center'
          } ${
            currentView === 'style' 
              ? 'bg-[var(--color-brand-main)]/10 text-[var(--color-brand-main)]' 
              : 'bg-transparent text-[var(--color-content-secondary)] hover:bg-[var(--color-border-default)]/50 hover:text-[var(--color-brand-dark)]'
          }`}
        >
          <Palette className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${currentView === 'style' ? 'text-[var(--color-brand-main)]' : 'text-[var(--color-content-secondary)] group-hover:text-[var(--color-brand-dark)]'}`} size={18} strokeWidth={1.625} />
          {isSidebarOpen && <span className="text-[13px] font-normal whitespace-nowrap ml-3">Estilos</span>}
        </button>

        <button 
          onClick={() => setCurrentView('mapeamento')}
          onMouseEnter={(e) => handleMouseEnter(e, 'Mapeamentos')}
          onMouseLeave={handleMouseLeave}
          className={`flex items-center h-8 rounded-md group transition-all duration-300 ease-in-out overflow-hidden focus:outline-none ${
            isSidebarOpen ? 'mx-4 px-3 w-[calc(100%-32px)]' : 'ml-4 w-8 px-0 justify-center'
          } ${
            currentView === 'mapeamento' 
              ? 'bg-[var(--color-brand-main)]/10 text-[var(--color-brand-main)]' 
              : 'bg-transparent text-[var(--color-content-secondary)] hover:bg-[var(--color-border-default)]/50 hover:text-[var(--color-brand-dark)]'
          }`}
        >
          <Database className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${currentView === 'mapeamento' ? 'text-[var(--color-brand-main)]' : 'text-[var(--color-content-secondary)] group-hover:text-[var(--color-brand-dark)]'}`} size={18} strokeWidth={1.625} />
          {isSidebarOpen && <span className="text-[13px] font-normal whitespace-nowrap ml-3">Mapeamentos</span>}
        </button>

        <button 
          onClick={() => setCurrentView('iam')}
          onMouseEnter={(e) => handleMouseEnter(e, 'Usuários')}
          onMouseLeave={handleMouseLeave}
          className={`flex items-center h-8 rounded-md group transition-all duration-300 ease-in-out overflow-hidden focus:outline-none ${
            isSidebarOpen ? 'mx-4 px-3 w-[calc(100%-32px)]' : 'ml-4 w-8 px-0 justify-center'
          } ${
            currentView === 'iam' 
              ? 'bg-[var(--color-brand-main)]/10 text-[var(--color-brand-main)]' 
              : 'bg-transparent text-[var(--color-content-secondary)] hover:bg-[var(--color-border-default)]/50 hover:text-[var(--color-brand-dark)]'
          }`}
        >
          <ShieldCheck className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${currentView === 'iam' ? 'text-[var(--color-brand-main)]' : 'text-[var(--color-content-secondary)] group-hover:text-[var(--color-brand-dark)]'}`} size={18} strokeWidth={1.625} />
          {isSidebarOpen && <span className="text-[13px] font-normal whitespace-nowrap ml-3">Usuários</span>}
        </button>
      </div>
    </>
  );
};
