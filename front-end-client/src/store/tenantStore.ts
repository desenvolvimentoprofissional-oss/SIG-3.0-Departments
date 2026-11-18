import { create } from 'zustand';
import { useConnectionStore } from './connectionStore';
import { subscribeToTenantsAPI, saveTenantConfigAPI, deleteTenantConfigAPI, deleteTenantFirebaseConfigAPI } from '../api/tenant.api';
import { TenantConfig } from '../types/index';
import { logger, sanitizeErrorForTelemetry } from '../lib/logger.util';

import { useAuthStore } from './authStore';

export function parseFirebaseSDK(input: string) {
  try {
    const jsonMatch = input.match(/const\s+firebaseConfig\s*=\s*({[\s\S]*?});/);
    if (jsonMatch && jsonMatch[1]) {
      const jsonStr = jsonMatch[1]
        .replace(/([{,])\s*(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '$1"$3":')
        .replace(/'/g, '"');
      return JSON.parse(jsonStr);
    }
  } catch (e) {
    return null;
  }
  return null;
}

interface TenantState {
  tenants: TenantConfig[];
  isLoading: boolean;
  error: string | null;
  subscribeToTenants: () => () => void;
  saveTenantConfig: (tenant: TenantConfig) => Promise<void>;
  saveFirebaseConfig: (deptId: string, deptInfo: any, sdkInput: string, configForm: any) => Promise<any>;
  deleteTenantConfig: (id: string) => Promise<void>;
  deleteTenantFirebaseConfig: (id: string) => Promise<void>;
  getTenantById: (id: string) => TenantConfig | undefined;
  getDepartmentsByArea: (assignedArea: string | null, role: string) => TenantConfig[];
}

export const useTenantStore = create<TenantState>((set, get) => ({
  tenants: [],
  isLoading: false,
  error: null,
  
  subscribeToTenants: () => {
    if (!useConnectionStore.getState().centralDb) return () => {};
    const user = useAuthStore.getState().user;
    if (!user) return () => {};
    
    set({ isLoading: true, error: null });
    
    let filters: { area?: string; departmentId?: string } = {};

    let isUnsubscribed = false;
    let unsubscribeLogic = () => {};

    unsubscribeLogic = subscribeToTenantsAPI(
      useConnectionStore.getState().centralDb,
      filters,
      (tenants) => {
        if (isUnsubscribed) return;
        set({ tenants, isLoading: false });
      },
      (error) => {
        if (isUnsubscribed) return;
        logger.error("ERR_SYNC_TENANTS", sanitizeErrorForTelemetry(error));
        set({ error: error.message, isLoading: false, tenants: [] });
        unsubscribeLogic();
      }
    );
    
    return () => {
      isUnsubscribed = true;
      unsubscribeLogic();
    };
  },

  saveTenantConfig: async (tenant: TenantConfig) => {
    if (!useConnectionStore.getState().centralDb) throw new Error("DB not connected");
    try {
      await saveTenantConfigAPI(useConnectionStore.getState().centralDb, tenant);
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  saveFirebaseConfig: async (deptId: string, deptInfo: any, sdkInput: string, configForm: any) => {
    if (!deptId) throw new Error('Departamento não selecionado');
    let configToSave = { ...configForm };

    if (!configForm.apiKey && sdkInput) {
       const parsedConfig = parseFirebaseSDK(sdkInput);
       if (!parsedConfig || !parsedConfig.apiKey) {
         throw new Error('Formato de SDK inválido. Certifique-se de colar o código completo forcenido pelo Firebase.');
       }
       configToSave = {
         apiKey: parsedConfig.apiKey || '',
         authDomain: parsedConfig.authDomain || '',
         projectId: parsedConfig.projectId || '',
         storageBucket: parsedConfig.storageBucket || '',
         messagingSenderId: parsedConfig.messagingSenderId || '',
         appId: parsedConfig.appId || ''
       };
    } else if (!configToSave.apiKey || !configToSave.projectId) {
      throw new Error('Os campos apiKey e projectId são obrigatórios.');
    }

    if (!deptInfo) {
      throw new Error('Informações do departamento não encontradas.');
    }

    const newConfig: TenantConfig = {
      id: deptId,
      name: deptInfo.name,
      area: deptInfo.area,
      iconId: deptInfo.icon ? (deptInfo.icon as any).displayName || deptInfo.icon.name || 'Building2' : undefined,
      firebaseConfig: configToSave as any,
      isActive: true,
      createdAt: Date.now()
    };

    await get().saveTenantConfig(newConfig);
    return configToSave;
  },

  deleteTenantConfig: async (id: string) => {
    if (!useConnectionStore.getState().centralDb) throw new Error("DB not connected");
    try {
      await deleteTenantConfigAPI(useConnectionStore.getState().centralDb, id);
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteTenantFirebaseConfig: async (id: string) => {
    if (!useConnectionStore.getState().centralDb) throw new Error("DB not connected");
    try {
      await deleteTenantFirebaseConfigAPI(useConnectionStore.getState().centralDb, id);
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  getTenantById: (id: string) => {
    return get().tenants.find(t => t.id === id);
  },

  getDepartmentsByArea: (assignedArea: string | null, role: string) => {
    return get().tenants;
  }
}));

