import { StateCreator } from 'zustand';
import { TenantConfig, PageMapping } from '../../types/index';
import { subscribeToMappingsAPI } from '../../api/mapping.read.api';
import { saveMappingAPI, deleteMappingAPI } from '../../api/mapping.write.api';
import { useConnectionStore } from '../connectionStore';
import { MappingStateSlice } from './mappingStateSlice';
import { logger, sanitizeErrorForTelemetry } from '../../lib/logger.util';

export interface MappingControlPlaneSlice {
  subscribeToMappings: (tenants: TenantConfig[]) => () => void;
  saveMapping: (tenant: TenantConfig, mapping: PageMapping) => Promise<void>;
  deleteMapping: (tenant: TenantConfig, id: string) => Promise<void>;
  getMappingsByDepartment: (departmentId: string) => PageMapping[];
}

export const createMappingControlPlaneSlice: StateCreator<
  MappingStateSlice & MappingControlPlaneSlice,
  [],
  [],
  MappingControlPlaneSlice
> = (set, get) => ({
  subscribeToMappings: (tenants: TenantConfig[]) => {
    set({ isLoading: true, error: null });
    
    if (tenants.length === 0) {
      set({ mappings: [], isLoading: false });
      return () => {};
    }

    try {
      const unsubscribe = subscribeToMappingsAPI(
        useConnectionStore.getState().centralDb,
        (systemMappings) => {
          const activeTenantIds = tenants.map(t => t.id);
          const filteredMappings = systemMappings.filter(m => activeTenantIds.includes(m.departmentId));
          set({ mappings: filteredMappings, isLoading: false });
        },
        (error) => {
          logger.error("ERR_SUBSCRIBE_MAPPINGS", sanitizeErrorForTelemetry(error));
          set({ isLoading: false, error: 'Erro de leitura do banco central', mappings: [] });
        }
      );
      return () => unsubscribe();
    } catch (err: any) {
      logger.error("ERR_INIT_MAPPINGS_DB", sanitizeErrorForTelemetry(err));
      set({ isLoading: false, mappings: [] });
      return () => {};
    }
  },

  saveMapping: async (tenant: TenantConfig, mapping: PageMapping) => {
    try {
      await saveMappingAPI(useConnectionStore.getState().centralDb, mapping);
    } catch (error: any) {
      throw new Error(`Erro ao salvar mapeamento no Control Plane: ${error.message}`);
    }
  },

  deleteMapping: async (tenant: TenantConfig, id: string) => {
    try {
      await deleteMappingAPI(useConnectionStore.getState().centralDb, id);
    } catch (error: any) {
      throw new Error(`Erro ao excluir mapeamento no Control Plane: ${error.message}`);
    }
  },

  getMappingsByDepartment: (departmentId: string) => {
    return get().mappings.filter(m => m.departmentId === departmentId);
  }
});
