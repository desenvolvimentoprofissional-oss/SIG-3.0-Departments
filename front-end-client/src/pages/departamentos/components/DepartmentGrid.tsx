import React from 'react';
import { SummaryCard } from '../../../components/ui/SummaryCard';
import { Layers, Users } from 'lucide-react';
import { TenantConfig, UserSessionProfile } from '../../../types/index';

interface DepartmentGridProps {
  filteredDepts: any[];
  tenants: TenantConfig[];
  mappings: any[];
  users: UserSessionProfile[];
  handleOpenConfig: (deptId: string) => void;
}

export const DepartmentGrid: React.FC<DepartmentGridProps> = ({
  filteredDepts,
  tenants,
  mappings,
  users,
  handleOpenConfig
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch w-full">
      {filteredDepts.map(dept => {
        const IconComponent = dept.icon;
        const tenant = tenants.find(t => t.id === dept.id);
        const hasSDK = !!tenant?.firebaseConfig;
        const totalAssets = mappings.filter(m => m.departmentId === dept.id).length;
        
        return (
          <SummaryCard
            key={dept.id}
            id={dept.id}
            title={dept.name}
            subtitle={dept.area}
            icon={IconComponent}
            metrics={[
              {
                icon: Layers,
                value: totalAssets,
                tooltip: 'Páginas Mapeadas e Webhooks'
              },
              {
                icon: Users,
                value: users.filter(u => {
                  if (u.role === 'MASTER') return u.viewerDepartments && u.viewerDepartments.includes(dept.id);
                  return u.departmentId === dept.id || (u.viewerDepartments && u.viewerDepartments.includes(dept.id)) || (u.role === 'ADMIN' && u.assignedArea === dept.area);
                }).length,
                tooltip: 'Usuários Vinculados'
              }
            ]}
            actionLabel="Ver Detalhes"
            onClick={handleOpenConfig}
          />
        );
      })}
    </div>
  );
};
