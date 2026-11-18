import { useState, useEffect, useMemo } from "react";
import { UserSessionProfile, UserRole, UserStatus } from "../types/index";
import { useAuthStore } from "../store/authStore";
import { useMappingStore } from "../store/mappingStore";
import { useTenantStore } from "../store/tenantStore";
import { AreaName, DEPARTMENT_TAXONOMY } from "../lib/taxonomia-icones";

export const useUserApproval = (
  user: UserSessionProfile,
  isOpen: boolean,
  onSave: (updates: Partial<UserSessionProfile>) => void
) => {
  const { user: currentUser } = useAuthStore();
  const { mappings } = useMappingStore();
  const { tenants } = useTenantStore();

  const [role, setRole] = useState<UserRole>(user.role);
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [assignedArea, setAssignedArea] = useState<string>(user.assignedArea || "");
  const [departmentId, setDepartmentId] = useState<string>(user.departmentId || "");
  const [viewerDepartments, setViewerDepartments] = useState<string[]>(user.viewerDepartments || []);
  const [viewerPages, setViewerPages] = useState<string[]>(user.viewerPages || []);

  useEffect(() => {
    if (isOpen) {
      setRole(user.role);
      setStatus(user.status);
      setAssignedArea(user.assignedArea || "");
      setDepartmentId(user.departmentId || "");
      setViewerDepartments(user.viewerDepartments || []);
      setViewerPages(user.viewerPages || []);
    }
  }, [isOpen, user]);

  const availablePages = useMemo(() => {
    if (!departmentId) return [];
    return mappings.filter((m) => m.departmentId === departmentId);
  }, [mappings, departmentId]);

  const handleToggleViewerDept = (pageId: string) => {
    setViewerDepartments((prev) =>
      prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId],
    );
  };

  const areas: AreaName[] = [
    "Administrativo-Financeira",
    "Controle",
    "Desenvolvimento",
    "Inovação e Desenvolvimento Profissional",
    "Presidência",
    "Relacionamento",
    "Tecnologia",
  ];

  const availableAreas = useMemo(() => {
    if (currentUser?.role === "MASTER") {
      const dynamicAreas = tenants.map((t) => t.area).filter(Boolean);
      return Array.from(new Set([...areas, ...dynamicAreas]));
    }
    if (currentUser?.role === "ADMIN") {
      const adminArea = currentUser.assignedArea || currentUser.departmentId;
      if (adminArea) {
        return [adminArea as AreaName];
      }
    }
    return [];
  }, [currentUser, tenants]);

  const availableDepartments = useMemo(() => {
    const allDeptsMap = new Map();
    DEPARTMENT_TAXONOMY.forEach((d) => allDeptsMap.set(d.id, d));
    tenants.forEach((t) => {
      if (t.area) allDeptsMap.set(t.id, { id: t.id, name: t.name, area: t.area });
    });
    let depts = Array.from(allDeptsMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    if (currentUser?.role === "ADMIN") {
      const adminArea = currentUser.assignedArea || currentUser.departmentId;
      if (adminArea) {
        depts = depts.filter((d) => d.area === adminArea || d.id === adminArea);
      }
    }
    return depts;
  }, [currentUser, tenants]);

  const handleSave = () => {
    onSave({
      role,
      status,
      assignedArea: (role === "ADMIN" || role === "MASTER") ? assignedArea : null,
      departmentId:
        role === "COLABORADOR" || role === "CONVIDADO"
          ? departmentId
          : null,
      viewerDepartments,
      viewerPages,
    });
  };

  const statusOptions = [
    { label: "AGUARDANDO ANÁLISE", value: "PENDING_APPROVAL" },
    { label: "ATIVO", value: "ACTIVE" },
    { label: "INATIVO", value: "INACTIVE" },
    { label: "RECUSADO", value: "REJECTED" },
    { label: "SUSPENSO", value: "SUSPENDED" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const roleOptions = [
    ...(currentUser?.role === "MASTER"
      ? [
          { label: "Master", value: "MASTER" },
          { label: "Administrador", value: "ADMIN" },
        ]
      : []),
    ...(currentUser?.role !== "MASTER" &&
    (role === "MASTER" || role === "ADMIN")
      ? [{ label: role === "MASTER" ? "Master" : "Administrador", value: role }]
      : []),
    { label: "Colaborador", value: "COLABORADOR" },
    { label: "Convidado", value: "CONVIDADO" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  return {
    currentUser,
    role,
    setRole,
    status,
    setStatus,
    assignedArea,
    setAssignedArea,
    departmentId,
    setDepartmentId,
    viewerDepartments,
    setViewerDepartments,
    viewerPages,
    setViewerPages,
    availablePages,
    availableAreas,
    availableDepartments,
    mappings,
    handleToggleViewerDept,
    handleSave,
    statusOptions,
    roleOptions,
  };
};
