import React, { useMemo, useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { useSearchStore } from "../../store/useSearchStore";
import { DEPARTMENT_TAXONOMY } from "../../lib/taxonomia-icones";
import { Search, Bell, Info, Filter, Plus, LogOut } from "lucide-react";
import { Select } from "../ui/Select";
import { Tooltip } from "../ui/Tooltip";

interface AppHeaderProps {
  currentView: string;
  getPageTitle: () => string;
  setShowInfo: (v: boolean) => void;
}

export const HeaderButton = ({ 
  onClick, 
  icon: Icon, 
  title, 
  ariaLabel, 
  className = "", 
  children,
  isActive = false
}: any) => {
  return (
    <Tooltip content={title} position="bottom">
      <button
        onClick={onClick}
        aria-label={ariaLabel || title}
        className={`w-7 h-7 rounded-md transition-all duration-200 flex items-center justify-center focus:outline-none group shadow-[0_1px_2px_rgba(0,0,0,0.02)] border ${isActive ? 'bg-[var(--color-brand-main)]/10 text-[var(--color-brand-main)] border-[var(--color-brand-main)]/30' : 'bg-white border-[var(--color-border-default)]/60 text-[var(--color-content-secondary)] hover:bg-[var(--color-background-light)] hover:border-[var(--color-border-default)] hover:text-[var(--color-brand-dark)]'} ${className}`}
      >
        <Icon size={16} strokeWidth={1.625} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
        {children}
      </button>
    </Tooltip>
  );
};

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentView,
  getPageTitle,
  setShowInfo,
}) => {
  const { user, logout } = useAuthStore();
  const {
    query,
    setQuery,
    filterArea,
    setFilterArea,
    filterDept,
    setFilterDept,
    filterStatus,
    setFilterStatus,
  } = useSearchStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const areas = useMemo(
    () =>
      Array.from(new Set(DEPARTMENT_TAXONOMY.map((d) => d.area))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [],
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  const hasActiveFilters =
    filterArea !== "" || filterDept !== "" || filterStatus !== "";

  if (currentView === "home") return null;

  return (
    <header className="h-14 flex items-center justify-between px-6 sm:px-10 bg-[#F8FAFC] border-b border-[var(--color-border-default)] shrink-0 gap-4">
      <div className="flex items-center shrink min-w-0">
        <h1 className="text-lg font-bold text-[var(--color-brand-dark)] tracking-tight truncate">
          {getPageTitle()}
        </h1>
      </div>
      <div className="flex items-center justify-end gap-3 min-w-0 ml-auto">
        
        {currentView !== "style" && (
          <>
            
            <div className="flex items-center gap-1.5">
              <div className="relative flex items-center justify-end">
                <Tooltip content="Pesquisar" position="bottom" className={isSearchFocused || query ? "w-64" : ""}>
                  <button
                    type="button"
                    aria-label="Abrir pesquisa"
                    className={`relative flex items-center transition-all duration-300 ease-out flex-shrink-0 rounded-md focus:outline-none shadow-[0_1px_2px_rgba(0,0,0,0.02)] border ${isSearchFocused || query ? "w-full bg-white border-[var(--color-border-default)] ring-2 ring-transparent focus-within:ring-[var(--color-brand-light)] focus-within:border-transparent cursor-text" : "w-7 h-7 bg-white border-[var(--color-border-default)]/60 text-[var(--color-content-secondary)] hover:bg-[var(--color-background-light)] hover:border-[var(--color-border-default)] hover:text-[var(--color-brand-dark)] cursor-pointer justify-center"}`}
                    onClick={(e) => {
                      if (!isSearchFocused && !query) {
                        const input = e.currentTarget.querySelector("input");
                        input?.focus();
                      }
                    }}
                  >
                    <Search
                      className={`absolute shrink-0 pointer-events-none transition-all duration-300 group-hover:scale-110 ${isSearchFocused || query ? "left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-content-tertiary)] w-4 h-4" : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4"}`}
                      strokeWidth={1.625}
                    />
                    <input
                      type="text"
                      placeholder={isSearchFocused || query ? "Search..." : ""}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className={`w-full h-7 bg-transparent pl-8 pr-3 outline-none text-[13px] text-[var(--color-content-primary)] placeholder-[var(--color-content-tertiary)] transition-opacity duration-200 rounded-md ${isSearchFocused || query ? "opacity-100" : "opacity-0 cursor-pointer pointer-events-none w-0 h-0 absolute"}`}
                    />
                  </button>
                </Tooltip>
              </div>

              {["iam", "departamentosAdmin", "avisos", "banners", "mapeamento"].includes(currentView) && (
                <div className="relative" ref={filterRef}>
                  <HeaderButton
                    icon={Filter}
                    isActive={isFilterOpen || hasActiveFilters}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    title="Filtros"
                  />
                  {isFilterOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[var(--color-border-default)] rounded-xl shadow-lg p-4 z-50 flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-bold text-[var(--color-content-primary)]">
                          Área
                        </span>
                        <Select
                          value={filterArea}
                          onChange={(e) => {
                            setFilterArea(e.target.value);
                            setFilterDept("");
                          }}
                          options={[
                            { label: "Todas as Áreas", value: "" },
                            ...areas.map((a) => ({ label: a, value: a })),
                          ]}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-bold text-[var(--color-content-primary)]">
                          Departamento
                        </span>
                        <Select
                          value={filterDept}
                          onChange={(e) => setFilterDept(e.target.value)}
                          disabled={!filterArea && filterArea !== ""}
                          options={[
                            { label: "Todos", value: "" },
                            ...DEPARTMENT_TAXONOMY.filter(
                              (d) => !filterArea || d.area === filterArea,
                            )
                              .map((d) => ({ label: d.name, value: d.id }))
                              .sort((a, b) => a.label.localeCompare(b.label)),
                          ]}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-bold text-[var(--color-content-primary)]">
                          Status
                        </span>
                        <Select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          options={
                            currentView === "iam"
                              ? [
                                  { label: "Todos", value: "" },
                                  { label: "Aguardando", value: "PENDING_APPROVAL" },
                                  { label: "Ativos", value: "ACTIVE" },
                                  { label: "Inativos", value: "INACTIVE" },
                                  { label: "Rejeitados", value: "REJECTED" },
                                  { label: "Suspensos", value: "SUSPENDED" },
                                ]
                              : [
                                  { label: "Todos", value: "" },
                                  { label: "Ativo", value: "ACTIVE" },
                                  { label: "Inativo", value: "INACTIVE" },
                                ]
                          }
                        />
                      </div>
                      {hasActiveFilters && (
                        <button
                          onClick={() => {
                            setFilterArea("");
                            setFilterDept("");
                            setFilterStatus("");
                          }}
                          className="mt-2 w-full py-2 bg-[var(--color-background-light)] text-[var(--color-content-secondary)] hover:text-[var(--color-brand-main)] hover:bg-[var(--color-content-inverse)] border border-[var(--color-border-default)] rounded-md text-sm font-semibold transition-colors"
                        >
                          Limpar Filtros
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-px h-5 bg-[var(--color-border-default)]" />

            <div className="flex items-center gap-1.5">
              <div
                id="header-portal-target"
                className="flex items-center gap-1.5 empty:hidden"
              ></div>
            </div>

            <div className="w-px h-5 bg-[var(--color-border-default)]" />
          </>
        )}

        <div className="flex items-center gap-1.5">
          <HeaderButton icon={Bell} title="Notificações" />

          <HeaderButton
            icon={Info}
            onClick={() => setShowInfo(true)}
            title="Informações da página"
          />

          <Tooltip content="Sair" position="bottom">
            <button
              onClick={logout}
              aria-label="Sair"
              className="w-7 h-7 rounded-md bg-white border border-[var(--color-border-default)]/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-center text-[var(--color-content-secondary)] hover:bg-[var(--color-status-error)]/5 hover:border-[var(--color-status-error)]/30 hover:text-[var(--color-status-error)] transition-all cursor-pointer focus:outline-none group"
            >
              <LogOut
                size={16}
                strokeWidth={1.625}
                className="shrink-0 transition-transform duration-300 group-hover:scale-110"
              />
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

