import { create } from 'zustand';
import { UserSessionProfile, UserRole, TenantConfig } from '../types/index';
import { syncUserSessionAPI } from '../api/auth.api';
import { getTenantConfigAPI } from '../api/tenant.api';
import { getTenantFirestore } from '../api/tenant.factory';
import { useConnectionStore } from './connectionStore';
import { auth } from '../api/firebase.client';
import { signInWithCustomToken } from 'firebase/auth';
import { logger, sanitizeErrorForTelemetry } from '../lib/logger.util';

export interface GoogleSignInUser {
  uid: string;
  email: string;
  name: string;
  avatarUrl: string;
  domain: string;
  status?: string;
  role?: UserRole;
  permissions?: string[];
  assignedArea?: string | null;
  departmentId?: string | null;
  primaryTenantId?: string;
  viewerDepartments?: string[];
  customToken?: string;
}

interface AuthState {
  user: UserSessionProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeTenantDb: any | null;
  login: (googleUser: GoogleSignInUser, tenantDb?: any) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  activeTenantDb: null,
  
  login: async (googleUser, tenantDb) => {
    const centralDb = useConnectionStore.getState().centralDb;
    if (!centralDb) throw new Error("Central DB not available");

    if (googleUser.customToken && auth) {
      try {
        await signInWithCustomToken(auth, googleUser.customToken);
      } catch (err) {
        logger.error("ERR_FIREBASE_LOGIN", sanitizeErrorForTelemetry(err));
      }
    }

    const userProfile = await syncUserSessionAPI(centralDb, googleUser as unknown as UserSessionProfile);

    
    let activeTenantDb = tenantDb || null;

    if (!activeTenantDb && userProfile.departmentId) {
      try {
        const tenantConfig = await getTenantConfigAPI(centralDb, userProfile.departmentId);
        if (tenantConfig && tenantConfig.firebaseConfig) {
          activeTenantDb = getTenantFirestore(tenantConfig);
        }
      } catch (err) {
        logger.error("ERR_INIT_TENANT_DB", sanitizeErrorForTelemetry(err));
      }
    }
    
    set({ user: userProfile, isAuthenticated: true, isLoading: false, activeTenantDb });
  },
  
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false, activeTenantDb: null }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

