import React, { useMemo } from "react";
import { Building2 } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useMappingStore } from "../../store/mappingStore";
import {
  DEPARTMENT_TAXONOMY,
  type DepartmentNode,
} from "../../lib/taxonomia-icones";
import { useTenantStore } from "../../store/tenantStore";
import { SidebarNavigationGroup } from "./SidebarNavigationGroup";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarProfile } from "./SidebarProfile";
import { SidebarAdminNav } from "./SidebarAdminNav";

import { resolveSecondaryDepartments, resolveVisibleMappings } from '../../lib/sidebar.util';

interface AppSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
  currentView: string;
  setCurrentView: (v: string) => void;
  handleMouseEnter: (e: React.MouseEvent, text: string) => void;
  handleMouseLeave: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  currentView,
  setCurrentView,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  const { user } = useAuthStore();
  const { mappings } = useMappingStore();
  const { tenants } = useTenantStore();

  const canManageUsers = user?.role === "MASTER" || user?.role === "ADMIN";

  const primaryDepartment = useMemo(() => {
    const dynamicTenant = tenants.find((t) => t.id === user?.departmentId);
    if (dynamicTenant) {
      const taxonomyDept = DEPARTMENT_TAXONOMY.find((dept) => dept.id === dynamicTenant.id);
      return { 
        id: dynamicTenant.id, 
        name: dynamicTenant.name, 
        area: dynamicTenant.area,
        icon: taxonomyDept?.icon || Building2
      } as DepartmentNode;
    }
    return DEPARTMENT_TAXONOMY.find((dept) => dept.id === user?.departmentId);
  }, [user, tenants]);

  const visibleMappings = useMemo(() => {
    return resolveVisibleMappings(mappings, user, DEPARTMENT_TAXONOMY);
  }, [mappings, user]);

  const secondaryDepartments = useMemo(() => {
    return resolveSecondaryDepartments(DEPARTMENT_TAXONOMY, user, visibleMappings);
  }, [user, visibleMappings]);

  if (!user) return null;

  return (
    <aside
      className={`${isSidebarOpen ? "w-72" : "w-16"} bg-[var(--color-content-inverse)] border-r border-[var(--color-border-default)] flex flex-col hidden sm:flex shrink-0 transition-all duration-300 ease-in-out overflow-hidden`}
    >
      <SidebarHeader
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-1">
        <nav className="space-y-1">
          {primaryDepartment && (
            <SidebarNavigationGroup
              areaName="Meu Departamento"
              isPrimary={true}
              depts={[primaryDepartment]}
              isSidebarOpen={isSidebarOpen}
              currentView={currentView}
              setCurrentView={setCurrentView}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              mappings={visibleMappings}
            />
          )}

          {secondaryDepartments.length > 0 && (
            <SidebarNavigationGroup
              areaName=""
              isPrimary={false}
              depts={secondaryDepartments}
              isSidebarOpen={isSidebarOpen}
              currentView={currentView}
              setCurrentView={setCurrentView}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              mappings={visibleMappings}
            />
          )}

          {canManageUsers && (
            <SidebarAdminNav
              user={user}
              isSidebarOpen={isSidebarOpen}
              currentView={currentView}
              setCurrentView={setCurrentView}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
            />
          )}
        </nav>
      </div>

      <SidebarProfile
        user={user}
        isSidebarOpen={isSidebarOpen}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
    </aside>
  );
};
