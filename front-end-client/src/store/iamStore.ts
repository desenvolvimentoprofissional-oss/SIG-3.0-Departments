import { create } from 'zustand';
import { UserSessionProfile } from '../types/index';
import { useConnectionStore } from './connectionStore';
import { subscribeToUsersAPI, updateUserAPI, addUserAPI } from '../api/iam.api';
import { useAuthStore } from './authStore';
import { logger, sanitizeErrorForTelemetry } from '../lib/logger.util';

interface IamState {
  users: UserSessionProfile[];
  initialized: boolean;
  initializeSync: () => () => void;
  updateUser: ( uid: string, updates: Partial<UserSessionProfile>, auditEvent?: { action: string; details: string; performedBy: string; }) => Promise<void>;
  addUser: (user: Partial<UserSessionProfile>) => Promise<void>;
}

export const useIamStore = create<IamState>((set, get) => ({
  users: [],
  initialized: false,
  
  initializeSync: () => {
    const db = useConnectionStore.getState().centralDb;
    if (!db) return () => {};
    
    const user = useAuthStore.getState().user;
    if (!user) return () => {};
    const tenantId = user.departmentId;
    if (!tenantId && !['MASTER', 'ADMIN'].includes(user.role)) return () => {};

    let isUnsubscribed = false;
    let unsubscribe = () => {};
    
    unsubscribe = subscribeToUsersAPI(
      db,
      ['MASTER', 'ADMIN'].includes(user.role) ? null : tenantId,
      (usersData) => {
        if (!isUnsubscribed) set({ users: usersData, initialized: true });
      },
      (error) => {
        if (!isUnsubscribed) {
          logger.error("ERR_IAM_SYNC", sanitizeErrorForTelemetry(error));
          set({ users: [], initialized: false });
        }
        unsubscribe();
      }
    );
    
    return () => {
      isUnsubscribed = true;
      unsubscribe();
    };
  },

  updateUser: async (uid, updates, auditEvent) => {
    const db = useConnectionStore.getState().centralDb;
    if (!db) return;
    try {
      let payload = { ...updates };
      if (auditEvent) {
         const existingUser = get().users.find(u => u.uid === uid);
         const newHistory = existingUser?.historyLog ? [...existingUser.historyLog] : [];
         newHistory.push({
            timestamp: Date.now(),
            action: auditEvent.action,
            details: auditEvent.details,
            performedBy: auditEvent.performedBy
         });
         payload.historyLog = newHistory;
      }
      await updateUserAPI(db, uid, payload);
    } catch (error) {
      logger.error("ERR_UPDATE_USER", sanitizeErrorForTelemetry(error));
    }
  },

  addUser: async (user) => {
    const db = useConnectionStore.getState().centralDb;
    if (!db) return;
    try {
      await addUserAPI(db, user);
    } catch (error) {
      logger.error("ERR_CREATE_USER", sanitizeErrorForTelemetry(error));
    }
  }
}));

