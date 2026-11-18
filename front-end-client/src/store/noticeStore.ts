import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserRole } from '../types/index';
import { subscribeToNoticesAPI, addNoticeAPI, removeNoticeAPI, updateNoticeAPI } from '../api/notices.api';
import { useAuthStore } from './authStore';
import { useConnectionStore } from './connectionStore';
import { logger, sanitizeErrorForTelemetry } from '../lib/logger.util';

export type NoticeType = 'info' | 'warning' | 'error';

export interface Notice {
  id: string;
  title: string;
  text: string;
  type: NoticeType;
  startDate: string;
  endDate: string;
  targetDepartments: string[];
  authorRole: UserRole;
  authorId: string;
  isPublished?: boolean;
  order?: number;
  createdAt?: number;
  createdBy?: string;
  createdByName?: string;
  createdByAvatar?: string;
  createdByDepartmentId?: string;
  createdByAreaId?: string;
  updatedAt?: number;
  updatedBy?: string;
  updatedByName?: string;
}

interface NoticesState {
  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id'>) => Promise<void>;
  removeNotice: (id: string) => Promise<void>;
  updateNotice: (id: string, notice: Partial<Omit<Notice, 'id'>>) => Promise<void>;
  updateNoticesOrder: (orderedIds: string[]) => Promise<void>;
  dismissedNoticeIds: Record<string, string[]>;
  sessionDismissedIds: Record<string, string[]>;
  dismissNotice: (userId: string, noticeId: string) => void;
  dismissNoticeSession: (userId: string, noticeId: string) => void;
  resetDismissed: (userId?: string) => void;
  subscribeToNotices: () => () => void;
}

export const useNoticeStore = create<NoticesState>()(
  persist(
    (set, get) => ({
      notices: [], 
      
      addNotice: async (notice) => {
        if (!useConnectionStore.getState().centralDb) return;
        try {
          const user = useAuthStore.getState().user;
          const newNotice = {
            ...notice,
            createdAt: Date.now(),
            createdBy: user?.uid,
            createdByName: user?.name,
            createdByAvatar: user?.avatarUrl || null,
            createdByDepartmentId: user?.departmentId || null,
            createdByAreaId: user?.assignedArea || null,
          };
          await addNoticeAPI(useConnectionStore.getState().centralDb, newNotice);
        } catch (error) {
          logger.error("ERR_SAVE_NOTICE", sanitizeErrorForTelemetry(error));
        }
      },
      
      removeNotice: async (id) => {
        if (!useConnectionStore.getState().centralDb) return;
        try {
          await removeNoticeAPI(useConnectionStore.getState().centralDb, id);
        } catch (error) {
          logger.error("ERR_DELETE_NOTICE", sanitizeErrorForTelemetry(error));
        }
      },
      
      updateNotice: async (id, update) => {
        if (!useConnectionStore.getState().centralDb) return;
        try {
          const user = useAuthStore.getState().user;
          const updatedNotice = {
            ...update,
            updatedAt: Date.now(),
            updatedBy: user?.uid,
            updatedByName: user?.name,
          };
          await updateNoticeAPI(useConnectionStore.getState().centralDb, id, updatedNotice);
        } catch (error) {
          logger.error("ERR_UPDATE_NOTICE", sanitizeErrorForTelemetry(error));
        }
      },
      
      updateNoticesOrder: async (orderedIds) => {
        if (!useConnectionStore.getState().centralDb) return;
        
        const { notices } = get();
        const updatedNotices = notices.map(notice => {
          const index = orderedIds.indexOf(notice.id);
          if (index !== -1) {
            return { ...notice, order: index };
          }
          return notice;
        });
        updatedNotices.sort((a, b) => (a.order || 0) - (b.order || 0));
        
        set({ notices: updatedNotices });
        
        try {
          await Promise.all(orderedIds.map((id, idx) => 
            updateNoticeAPI(useConnectionStore.getState().centralDb, id, { order: idx })
          ));
        } catch(e) {
          logger.error("ERR_REORDER_NOTICES", sanitizeErrorForTelemetry(e));
        }
      },

      dismissedNoticeIds: {},
      sessionDismissedIds: {},
      
      dismissNotice: (userId, noticeId) => set((state) => {
        const userDismissed = state.dismissedNoticeIds[userId] || [];
        if (userDismissed.includes(noticeId)) return state;
        return {
          dismissedNoticeIds: {
            ...state.dismissedNoticeIds,
            [userId]: [...userDismissed, noticeId]
          }
        };
      }),

      dismissNoticeSession: (userId, noticeId) => set((state) => {
        const userDismissed = state.sessionDismissedIds[userId] || [];
        if (userDismissed.includes(noticeId)) return state;
        return {
          sessionDismissedIds: {
            ...state.sessionDismissedIds,
            [userId]: [...userDismissed, noticeId]
          }
        };
      }),
      
      resetDismissed: (userId) => set((state) => {
        if (userId) {
          return { dismissedNoticeIds: { ...state.dismissedNoticeIds, [userId]: [] } };
        }
        return { dismissedNoticeIds: {} };
      }),

      subscribeToNotices: () => {
        if (!useConnectionStore.getState().centralDb) return () => {};
        const user = useAuthStore.getState().user;
        if (!user) return () => {};
        const tenantId = user.departmentId;
        if (!tenantId && !['MASTER', 'ADMIN'].includes(user.role)) return () => {};
        return subscribeToNoticesAPI(
          useConnectionStore.getState().centralDb,
          ['MASTER', 'ADMIN'].includes(user.role) ? null : tenantId,
          (fetchedNotices) => {
            set({ notices: fetchedNotices as Notice[] });
          },
          (error) => {
            logger.error("ERR_SUBSCRIBE_NOTICES", sanitizeErrorForTelemetry(error));
            set({ notices: [] });
          }
        );
      }
    }),
    {
      name: 'sig-notices-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ dismissedNoticeIds: state.dismissedNoticeIds }),
    }
  )
);

