import { Notice } from '../store/noticeStore';
import { UserSessionProfile } from '../types/index';
import { DEPARTMENT_TAXONOMY } from '../lib/taxonomia-icones';

export const isNoticeActive = (notice: Notice, today: string, userDismissed: string[]): boolean => {
  if (notice.isPublished === false) return false;
  if (userDismissed.includes(notice.id)) return false;
  return !(notice.startDate > today || notice.endDate < today);
};

const isTargetingUserDir = (notice: Notice, assignedArea: string): boolean => {
  return notice.targetDepartments.some(dId => {
    const checkDept = DEPARTMENT_TAXONOMY.find(d => d.id.toLowerCase() === dId.toLowerCase());
    return checkDept && checkDept.area === assignedArea;
  });
};

export const isNoticeForUser = (notice: Notice, user: UserSessionProfile): boolean => {
  if (notice.targetDepartments.includes('ALL')) return true;
  
  const userDeptMatch = user.departmentId && notice.targetDepartments.some(t => t.toLowerCase() === user.departmentId?.toLowerCase());
  if (userDeptMatch) return true;

  return false;
};

export const filterRelevantNotices = (notices: Notice[], user: UserSessionProfile, userDismissed: string[], today: string): Notice[] => {
  return notices.filter(n => isNoticeActive(n, today, userDismissed) && isNoticeForUser(n, user));
};

export const sortNoticesByPriority = (notices: Notice[]): Notice[] => {
  return [...notices].sort((a, b) => (a.order || 0) - (b.order || 0));
};
