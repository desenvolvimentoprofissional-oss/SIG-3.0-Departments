import { StateCreator } from 'zustand';
import { PageMapping } from '../../types/index';

export interface MappingStateSlice {
  mappings: PageMapping[];
  isLoading: boolean;
  error: string | null;
  pageData: any[];
  pageDataLoading: boolean;
  pageDataError: string | null;
  ultimaAtualizacaoDoc: any | null;
  setUltimaAtualizacaoDoc: (doc: any | null) => void;
  userCustomOrders: Record<string, string[]>;
  mappingsOrderTimestamp: number;
  setCustomOrder: (key: string, order: string[]) => void;
  notifyOrderChange: () => void;
}

export const createMappingStateSlice: StateCreator<MappingStateSlice, [], [], MappingStateSlice> = (set) => ({
  mappings: [],
  isLoading: false,
  error: null,
  pageData: [],
  pageDataLoading: false,
  pageDataError: null,
  ultimaAtualizacaoDoc: null,
  setUltimaAtualizacaoDoc: (doc) => set({ ultimaAtualizacaoDoc: doc }),
  userCustomOrders: {},
  mappingsOrderTimestamp: Date.now(),
  setCustomOrder: (key, order) => set((state) => ({
    userCustomOrders: { ...state.userCustomOrders, [key]: order }
  })),
  notifyOrderChange: () => set({ mappingsOrderTimestamp: Date.now() })
});
