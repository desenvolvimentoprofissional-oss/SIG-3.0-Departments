import { UserSessionProfile } from "../types/index";
import { Notice } from "../store/noticeStore";

export function canEditUser(currentUser: UserSessionProfile | null, targetUser: UserSessionProfile): boolean {
  if (!currentUser) return false;
  if (currentUser.role === 'MASTER') return true;
  if (currentUser.role === 'ADMIN' && targetUser.uid !== currentUser.uid) return true;
  return false;
}

function canViewDepartment(user: UserSessionProfile | null, departmentId: string): boolean {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  if (user.role === 'ADMIN') return true;
  if (user.role === 'COLABORADOR' || user.role === 'CONVIDADO') {
    return user.departmentId === departmentId || (user.viewerDepartments || []).includes(departmentId);
  }
  return false;
}

export function canManageNotice(
  user: UserSessionProfile,
  notice?: Notice,
): boolean {
  if (user.role === "MASTER") return true;
  if (user.role === "ADMIN") {
    if (!notice) return true;
    return notice.authorId === user.uid;
  }
  return false;
}

export function canManageBanner(
  user: UserSessionProfile,
  bannerAuthorId?: string,
): boolean {
  if (user.role === "MASTER") return true;
  if (user.role === "ADMIN")
    return !bannerAuthorId || bannerAuthorId === user.uid;
  return false;
}

function canEditStyles(user: UserSessionProfile): boolean {
  return user.role === "MASTER";
}

export function canManageMapping(
  user: UserSessionProfile,
  departmentArea: string | null,
): boolean {
  if (user.role === "MASTER") return true;
  if (
    user.role === "ADMIN" &&
    user.assignedArea &&
    departmentArea === user.assignedArea
  )
    return true;
  return false;
}
