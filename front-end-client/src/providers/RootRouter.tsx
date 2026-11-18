import React from "react";
import { useTenantStore } from "../store/tenantStore";
import { useMappingStore } from "../store/mappingStore";
import { IamDashboard } from "../pages/IamDashboard";
import { DepartmentManagementView } from "../pages/DepartmentManagementView";
import { NoticeManagementView } from "../pages/NoticeManagementView";
import { DataMappingView } from "../pages/DataMappingView";
import { MappedPageView } from "../pages/MappedPageView";
import { StyleGuideView } from "../pages/StyleGuideView";
import { BannerManagementView } from "../pages/BannerManagementView";
import { VisaoGeralView } from "../pages/VisaoGeralView";

interface RootRouterProps {
  currentView: string;
}

export const RootRouter: React.FC<RootRouterProps> = ({ currentView }) => {
  const { tenants } = useTenantStore();
  const { mappings } = useMappingStore();

  if (currentView === "iam") return <IamDashboard />;
  if (currentView === "departamentosAdmin") return <DepartmentManagementView />;
  if (currentView === "avisos") return <NoticeManagementView />;
  if (currentView === "mapeamento") return <DataMappingView />;
  if (currentView === "visaoGeral") return <VisaoGeralView />;
  if (currentView === "style") return <StyleGuideView />;
  if (currentView === "banners") return <BannerManagementView />;
  if (currentView === "unauthorized") {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-center h-full">
        <h2 className="text-xl font-bold text-[var(--color-content-primary)] mb-2">
          Sem Acesso
        </h2>
        <p className="text-[var(--color-content-secondary)]">
          Você não possui permissão para visualizar nenhuma página no momento.
        </p>
      </div>
    );
  }

  if (currentView.startsWith("page_")) {
    const lastUnderscore = currentView.lastIndexOf("_");
    const deptId = currentView.substring(5, lastUnderscore);
    const mappingId = currentView.substring(lastUnderscore + 1);
    const deptTenant = tenants.find((t) => t.id === deptId);
    const mapping = mappings.find((m) => m.id === mappingId);
    if (!deptTenant || !mapping) {
      return (
        <div className="p-10 text-center text-[var(--color-content-tertiary)]">
          Página não encontrada ou sem permissão.
        </div>
      );
    }
    return <MappedPageView tenant={deptTenant} mapping={mapping} />;
  }

  return (
    <div className="p-6 sm:p-10 flex-1 flex flex-col items-center overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-7xl">
        
      </div>
    </div>
  );
};
