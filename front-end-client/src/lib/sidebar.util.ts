import { DepartmentNode } from "./taxonomia-icones";

const isDeptVisibleForAdmin = (dept: DepartmentNode, user: any, visibleMappings: any[]): boolean => {
  if (dept.id === user?.departmentId) return false;
  if (dept.area === user?.assignedArea) return true;
  if (user?.viewerDepartments?.includes(dept.id)) return true;
  return visibleMappings.some((m) => m.departmentId === dept.id && user?.viewerPages?.includes(m.id));
};

const isDeptVisibleForDefault = (dept: DepartmentNode, user: any, visibleMappings: any[]): boolean => {
  if (dept.id === user?.departmentId) return false;
  if (user?.viewerDepartments?.includes(dept.id)) return true;
  return visibleMappings.some((m) => m.departmentId === dept.id && user?.viewerPages?.includes(m.id));
};

const filterDepartmentsForUser = (taxonomy: readonly DepartmentNode[], user: any, visibleMappings: any[]): DepartmentNode[] => {
  const role = user?.role;
  let filtered = [...taxonomy];
  
  if (role === "MASTER") {
    filtered = filtered.filter((dept) => dept.id !== user?.departmentId);
  } else if (role === "ADMIN") {
    filtered = filtered.filter((dept) => isDeptVisibleForAdmin(dept, user, visibleMappings));
  } else {
    filtered = filtered.filter((dept) => isDeptVisibleForDefault(dept, user, visibleMappings));
  }
  
  return filtered;
};

export const resolveSecondaryDepartments = (taxonomy: readonly DepartmentNode[], user: any, visibleMappings: any[]): DepartmentNode[] => {
  const filtered = filterDepartmentsForUser(taxonomy, user, visibleMappings);
  return filtered.sort((a, b) => {
    const nameA = (a.name || '').trim().toLowerCase();
    const nameB = (b.name || '').trim().toLowerCase();
    return nameA.localeCompare(nameB, 'pt-BR', { numeric: true, sensitivity: 'base' });
  });
};

const checkAdminMappingVisibility = (m: any, user: any): boolean => {
  if (m.departmentId === user.departmentId) return true;
  if (user.viewerPages?.includes(m.id)) return true;
  if (user.viewerDepartments?.includes(m.departmentId)) return true;
  return false;
};

const isAdminMappingVisible = (m: any, user: any, taxonomy: readonly DepartmentNode[]): boolean => {
  if (checkAdminMappingVisibility(m, user)) return true;
  const dept = taxonomy.find((d) => d.id === m.departmentId);
  return dept?.area === user.assignedArea;
};

const isDefaultMappingVisible = (m: any, user: any): boolean => {
  if (m.status === 'DRAFT' || m.status === 'ARCHIVED' || m.status === 'RASCUNHO') return false;
  if (m.departmentId === user?.departmentId) return true;
  if (user?.viewerPages?.includes(m.id)) return true;
  return !!user?.viewerDepartments?.includes(m.departmentId);
};

export const resolveVisibleMappings = (mappings: any[], user: any, taxonomy: readonly DepartmentNode[]) => {
  if (user?.role === "MASTER") return mappings;
  if (user?.role === "ADMIN") {
    return mappings.filter((m) => isAdminMappingVisible(m, user, taxonomy));
  }
  return mappings.filter((m) => isDefaultMappingVisible(m, user));
};
