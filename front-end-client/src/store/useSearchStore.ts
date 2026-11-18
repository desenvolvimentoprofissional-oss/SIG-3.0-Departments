import { create } from 'zustand';

interface SearchState {
  query: string;
  setQuery: (query: string) => void;
  filterArea: string;
  setFilterArea: (area: string) => void;
  filterDept: string;
  setFilterDept: (dept: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  filterArea: '',
  setFilterArea: (filterArea) => set({ filterArea }),
  filterDept: '',
  setFilterDept: (filterDept) => set({ filterDept }),
  filterStatus: '',
  setFilterStatus: (filterStatus) => set({ filterStatus }),
  reset: () => set({ query: '', filterArea: '', filterDept: '', filterStatus: '' })
}));

