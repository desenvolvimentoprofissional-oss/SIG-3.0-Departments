export const sanitizeAndVerifyAuthPayload = (payload: any): any => {
  if (!payload || typeof payload !== 'object') {
    throw new Error("Payload inválido ou corrompido.");
  }
  
  const verifiedTenantId = payload?.customClaims?.tenantId || payload?.tenantId;

  const role = payload?.customClaims?.role || 'PENDING_ROLE';
  const status = payload?.customClaims?.status || 'PENDING_APPROVAL';
  const assignedArea = payload?.customClaims?.assignedArea || null;
  
  return {
    uid: payload.sub || payload.id,
    email: payload.email,
    name: payload.name || 'Usuário',
    avatarUrl: payload.picture || '',
    domain: payload.hd || payload.email?.split('@')[1] || 'generic',
    role: role,
    status: status,
    primaryTenantId: verifiedTenantId || '',
    assignedArea: assignedArea,
    departmentId: null,
    viewerDepartments: []
  };
};
