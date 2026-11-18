import { UserSessionProfile } from '../types';
import { DEPARTMENT_TAXONOMY } from '../lib/taxonomia-icones';
import { getLocalISODate } from './date.util';

function matchStringSearch(source: string | undefined | null, q: string): boolean {
  if (!source) return false;
  return source.toLowerCase().includes(q);
}

function findDynamicArea(deptId: string, tenants: any[]): string | undefined {
  const t = tenants.find(x => x.id === deptId);
  return t ? t.area : undefined;
}

function findStaticArea(deptId: string): string | undefined {
  const d = DEPARTMENT_TAXONOMY.find(x => x.id === deptId);
  return d ? d.area : undefined;
}

function getDeptArea(deptId: string, tenants: any[]): string | undefined {
  const dynamicArea = findDynamicArea(deptId, tenants);
  if (dynamicArea) return dynamicArea;
  return findStaticArea(deptId);
}

function getUserArea(u: UserSessionProfile, t: any[]): string | undefined {
  if (u.assignedArea) return u.assignedArea;
  if (u.departmentId) return getDeptArea(u.departmentId, t);
  return undefined;
}

function isUserVisibleForAdmin(u: UserSessionProfile, current: UserSessionProfile, t: any[]): boolean {
  if (u.status === 'PENDING_APPROVAL') return true;
  const adminArea = current.assignedArea || (current.departmentId ? getDeptArea(current.departmentId, t) : undefined);
  if (!adminArea) return false;
  return getUserArea(u, t) === adminArea;
}

function isUserVisibleForRole(u: UserSessionProfile, current: UserSessionProfile, t: any[]): boolean {
  if (current.role === 'MASTER') return true;
  if (current.role !== 'ADMIN') return false;
  return isUserVisibleForAdmin(u, current, t);
}

function matchUserQuery(u: UserSessionProfile, q: string): boolean {
  if (!q) return true;
  const nameMatches = matchStringSearch(u.name, q);
  return nameMatches ? true : matchStringSearch(u.email, q);
}

function matchUserArea(u: UserSessionProfile, fArea: string, t: any[]): boolean {
  if (!fArea) return true;
  if (u.status === 'PENDING_APPROVAL') return true;
  return getUserArea(u, t) === fArea;
}

function matchUserStatus(u: UserSessionProfile, fStatus: string): boolean {
  if (!fStatus) return true;
  return u.status === fStatus;
}

export function filterUsers(
  users: UserSessionProfile[],
  currentUser: UserSessionProfile | null,
  tenants: any[],
  query: string,
  filterArea: string,
  filterDept: string,
  filterStatus: string
): UserSessionProfile[] {
  if (!currentUser) return [];
  const lowerQuery = query.trim().toLowerCase();

  return users.filter(u => {
    if (!isUserVisibleForRole(u, currentUser, tenants)) return false;
    if (!matchUserQuery(u, lowerQuery)) return false;
    if (!matchUserArea(u, filterArea, tenants)) return false;
    if (filterDept && u.status !== 'PENDING_APPROVAL' && u.departmentId !== filterDept) return false;
    if (!matchUserStatus(u, filterStatus)) return false;
    return true;
  });
}

const ROLE_MAP: Record<string, string> = {
  'MASTER': 'Master',
  'ADMIN': 'Administrador',
  'COLABORADOR': 'Colaborador',
  'CONVIDADO': 'Convidado'
};

export function mapRoleName(role: string): string {
  return ROLE_MAP[role] || role;
}

export function combineDepartments(baseTaxonomy: readonly any[], tenants: any[], iconsRef: any) {
  const base = [...baseTaxonomy];
  tenants.forEach(t => {
    if (!base.find(b => b.id === t.id)) {
      base.push({
        id: t.id,
        name: t.name,
        area: t.area as any,
        icon: (t.iconId && iconsRef[t.iconId as keyof typeof iconsRef]) ? iconsRef[t.iconId as keyof typeof iconsRef] as any : iconsRef.Building2
      });
    }
  });
  return base.sort((a, b) => a.name.localeCompare(b.name));
}

function matchDeptQuery(dept: any, q: string): boolean {
  if (!q) return true;
  const nameMatches = matchStringSearch(dept.name, q);
  return nameMatches ? true : matchStringSearch(dept.area, q);
}

function isDeptVisibleForAdmin(deptArea: string, userArea?: string | null): boolean {
  if (!userArea) return true;
  return deptArea === userArea;
}

function matchDeptPermissions(dept: any, isAdmin: boolean, userArea?: string | null, fArea?: string): boolean {
  if (isAdmin) {
    if (!isDeptVisibleForAdmin(dept.area, userArea)) return false;
  }
  if (fArea) {
    if (dept.area !== fArea) return false;
  }
  return true;
}

function checkDeptStatusMatch(fStatus: string, hasSDK: boolean): boolean {
  if (fStatus === 'ACTIVE') return hasSDK;
  if (fStatus === 'INACTIVE') return !hasSDK;
  return true;
}

function matchDeptStatus(deptId: string, fStatus: string, sdkSet: Set<string> | null): boolean {
  if (!fStatus) return true;
  if (!sdkSet) return true;
  return checkDeptStatusMatch(fStatus, sdkSet.has(deptId));
}

export function filterDepartments(
  rawDepts: any[],
  user: UserSessionProfile | null,
  tenants: any[],
  query: string,
  filterArea: string,
  filterDept: string,
  filterStatus: string
) {
  const lowerQuery = query ? query.toLowerCase() : '';
  const isAdmin = user?.role === 'ADMIN';
  const userArea = user?.assignedArea;

  let tenantsWithSDK: Set<string> | null = null;
  if (filterStatus) {
    tenantsWithSDK = new Set();
    tenants.forEach(t => {
      if (t.firebaseConfig) {
        tenantsWithSDK!.add(t.id);
      }
    });
  }

  return rawDepts.filter(d => {
    if (!matchDeptPermissions(d, isAdmin, userArea, filterArea)) return false;
    if (filterDept && d.id !== filterDept) return false;
    if (!matchDeptQuery(d, lowerQuery)) return false;
    if (!matchDeptStatus(d.id, filterStatus, tenantsWithSDK)) return false;
    return true;
  });
}

function isNoticeExpired(n: any, today: string): boolean {
  if (!n.endDate) return false;
  return n.endDate < today;
}

function isNoticePending(n: any, today: string): boolean {
  if (!n.startDate) return false;
  return n.startDate > today;
}

function isNoticeActive(n: any, today: string): boolean {
  if (isNoticeExpired(n, today)) return false;
  if (isNoticePending(n, today)) return false;
  return n.isPublished !== false;
}

function matchNoticePermission(notice: any, user: any): boolean {
  if (user.role === 'MASTER') return true;
  if (user.role !== 'ADMIN') return false;
  return notice.authorId === user.uid;
}

function matchNoticeQuery(notice: any, q: string): boolean {
  if (!q) return true;
  const titleMatches = matchStringSearch(notice.title, q);
  return titleMatches ? true : matchStringSearch(notice.text, q);
}

function matchNoticeFilters(notice: any, fArea: string, fDept: string): boolean {
  if (fArea) {
    if (notice.createdByAreaId !== fArea) return false;
  }
  if (fDept) {
    if (notice.createdByDepartmentId !== fDept) return false;
  }
  return true;
}

function matchNoticeStatus(notice: any, fStatus: string, today: string): boolean {
  if (!fStatus) return true;
  const isActive = isNoticeActive(notice, today);
  return fStatus === 'ACTIVE' ? isActive : !isActive;
}

export function filterNotices(
  notices: any[],
  user: any,
  query: string,
  filterArea: string,
  filterDept: string,
  filterStatus: string
) {
  if (!user) return [];

  const lowerQuery = query ? query.toLowerCase() : '';
  const today = getLocalISODate();

  return notices.filter(n => {
    if (!matchNoticePermission(n, user)) return false;
    if (!matchNoticeQuery(n, lowerQuery)) return false;
    if (!matchNoticeFilters(n, filterArea, filterDept)) return false;
    if (!matchNoticeStatus(n, filterStatus, today)) return false;
    return true;
  });
}

const STATUS_MAP: Record<string, string> = {
  'ACTIVE': 'Ativo',
  'PENDING_APPROVAL': 'Aguardando Análise',
  'SUSPENDED': 'Suspenso',
  'INACTIVE': 'Inativo',
  'REJECTED': 'Recusado',
  'REJEITADO': 'Recusado'
};

export function mapStatusName(status: string): string {
  return STATUS_MAP[status] || status;
}
