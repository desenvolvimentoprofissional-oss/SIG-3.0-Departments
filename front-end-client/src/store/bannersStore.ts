import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { useConnectionStore } from './connectionStore';
import { subscribeToBannerAPI, addBannerItemAPI, updateBannerItemAPI, removeBannerItemAPI } from '../api/banners.api';
import { logger, sanitizeErrorForTelemetry } from '../lib/logger.util';

export interface BannerItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  tag?: string;
  tagColor?: 'blue-light' | 'blue-dark' | 'orange';
  buttonText?: string;
  buttonLink?: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  isPinned?: boolean;
  filterType?: 'none' | 'default' | 'dark';
  createdAt: number;
  createdBy?: string;
  createdByName?: string;
  createdByAvatar?: string;
  createdByDepartmentId?: string;
  createdByAreaId?: string;
  updatedAt?: number;
  updatedBy?: string;
  updatedByName?: string;
  orderIndex: number;
}

interface BannersState {
  items: BannerItem[];
  addItem: (item: Omit<BannerItem, 'id' | 'createdAt' | 'orderIndex'>) => Promise<void>;
  updateItem: (id: string, item: Partial<Omit<BannerItem, 'id' | 'createdAt'>>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  reorderItems: (orderedIds: string[]) => Promise<void>;
  subscribeToItems: () => () => void;
  uploadImage: (file: File, pathPrefix: string) => Promise<string>;
}

export const useBannersStore = create<BannersState>()((set, get) => ({
  items: [],
  
  addItem: async (item) => {
    if (!useConnectionStore.getState().centralDb) return;
    try {
      const state = get();
      const user = useAuthStore.getState().user;
      const currentMaxOrder = state.items.length > 0 ? Math.max(...state.items.map(i => i.orderIndex || 0)) : 0;
      
      const newItem = { 
        ...item, 
        id: '',
        createdAt: Date.now(),
        createdBy: user?.uid,
        createdByName: user?.name,
        createdByAvatar: user?.avatarUrl || null,
        createdByDepartmentId: user?.departmentId || null,
        createdByAreaId: user?.assignedArea || null,
        orderIndex: currentMaxOrder + 1
      } as BannerItem;
      
      await addBannerItemAPI(useConnectionStore.getState().centralDb, newItem);
    } catch (error) {
      logger.error("ERR_SAVE_BANNER", sanitizeErrorForTelemetry(error));
    }
  },
  
  updateItem: async (id, update) => {
    if (!useConnectionStore.getState().centralDb) return;
    try {
      const user = useAuthStore.getState().user;
      await updateBannerItemAPI(useConnectionStore.getState().centralDb, id, {
        ...update,
        updatedAt: Date.now(),
        updatedBy: user?.uid,
        updatedByName: user?.name,
      });
    } catch (error) {
      logger.error("ERR_UPDATE_BANNER", sanitizeErrorForTelemetry(error));
    }
  },
  
  removeItem: async (id) => {
    if (!useConnectionStore.getState().centralDb) return;
    try {
      await removeBannerItemAPI(useConnectionStore.getState().centralDb, id);
    } catch (error) {
      logger.error("ERR_DELETE_BANNER", sanitizeErrorForTelemetry(error));
    }
  },

  reorderItems: async (orderedIds) => {
    if (!useConnectionStore.getState().centralDb) return;
    try {
      const currentItems = [...get().items];
      for (let i = 0; i < orderedIds.length; i++) {
        const id = orderedIds[i];
        await updateBannerItemAPI(useConnectionStore.getState().centralDb, id, { orderIndex: i });
      }
    } catch (error) {
      logger.error("ERR_REORDER_BANNERS", sanitizeErrorForTelemetry(error));
    }
  },
  
  subscribeToItems: () => {
    if (!useConnectionStore.getState().centralDb) return () => {};
    const user = useAuthStore.getState().user;
    
    let queryTenantId = undefined;

    if (user) {
      if (['MASTER', 'ADMIN'].includes(user.role)) {
        queryTenantId = null;
      } else {
        queryTenantId = user.departmentId;
        if (!queryTenantId) {
            queryTenantId = undefined;
        }
      }
    }
        
    const unsubscribe = subscribeToBannerAPI(
      useConnectionStore.getState().centralDb,
      queryTenantId,
      (items) => set({ items }),
      (error) => {
        logger.error("ERR_SUBSCRIBE_BANNERS", sanitizeErrorForTelemetry(error));
        set({ items: [] });
      }
    );
    return unsubscribe;
  },

  uploadImage: async (file, pathPrefix) => {
    const { uploadImageAPI } = await import('../api/storage.api');
    return uploadImageAPI(file, pathPrefix);
  }
}));

