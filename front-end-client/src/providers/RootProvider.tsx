import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import { useSearchStore } from '../store/useSearchStore';
import { useNoticeStore, Notice } from '../store/noticeStore';
import { useBannersStore } from '../store/bannersStore';
import { useTenantStore } from '../store/tenantStore';
import { getCurrentUserAPI } from '../api/auth.api';
import { useMappingStore } from '../store/mappingStore';
import { DEPARTMENT_TAXONOMY } from '../lib/taxonomia-icones';

export const RootProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { login, isAuthenticated, user, activeTenantDb } = useAuthStore();
  const { reset: resetSearch } = useSearchStore();
  const { notices, dismissedNoticeIds, subscribeToNotices } = useNoticeStore();
  const { subscribeToItems: subscribeToBanners } = useBannersStore();
  const { tenants, subscribeToTenants } = useTenantStore();
  const { subscribeToMappings } = useMappingStore();

  const [checkingInitialAuth, setCheckingInitialAuth] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      const unsubTenants = subscribeToTenants();
      return () => unsubTenants();
    }
  }, [isAuthenticated, user, subscribeToTenants]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const activeTenants = tenants.filter(t => (t.isActive && !!t.firebaseConfig) || user.role === 'MASTER');
      if (activeTenants.length > 0) {
        const unsubMappings = subscribeToMappings(activeTenants);
        return () => {
          unsubMappings();
        };
      }
    }
  }, [isAuthenticated, user, tenants, subscribeToMappings]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const unsubNotices = subscribeToNotices();
      const unsubBanners = subscribeToBanners();
      return () => {
        unsubNotices();
        unsubBanners();
      };
    }
  }, [isAuthenticated, user, subscribeToNotices, subscribeToBanners]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const rawData = await getCurrentUserAPI();
        if (rawData) {
          const userSchema = z.object({
            user: z.object({
              sub: z.string().optional(),
              id: z.string().optional(),
              email: z.string().email(),
              name: z.string().optional(),
              picture: z.string().optional(),
              hd: z.string().optional(),
              tenantId: z.string().optional().nullable(),
              customClaims: z.record(z.string(), z.any()).optional().nullable()
            }).passthrough()
          }).passthrough();
          
          const data = userSchema.parse(rawData);
          
          if (data.user) {

             const verifiedTenantId = data.user.customClaims?.tenantId || data.user.tenantId || null;

             await login({
                uid: data.user.sub || data.user.id || '',
                email: data.user.email,
                name: data.user.name || 'Usuário',
                avatarUrl: data.user.picture || '',
                domain: data.user.hd || data.user.email.split('@')[1] || 'generic',
                role: 'CONVIDADO', 
                status: 'PENDING_APPROVAL', 
                primaryTenantId: verifiedTenantId,
                assignedArea: null,
                departmentId: null,
                viewerDepartments: []
             });
          }
        }
      } catch (err) {
      } finally {
        setCheckingInitialAuth(false);
      }
    };
    checkAuthStatus();
  }, [login]);

  if (checkingInitialAuth) {
    return (
      <div className="min-h-screen w-full bg-[var(--color-background-light)] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--color-brand-main)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
};
