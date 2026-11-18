import { create } from 'zustand';
import { MappingStateSlice, createMappingStateSlice } from './mapping/mappingStateSlice';
import { MappingDataSlice, createMappingDataSlice } from './mapping/mappingDataSlice';
import { MappingControlPlaneSlice, createMappingControlPlaneSlice } from './mapping/mappingControlPlaneSlice';

type MappingState = MappingStateSlice & MappingDataSlice & MappingControlPlaneSlice;

export const useMappingStore = create<MappingState>((...a) => ({
  ...createMappingStateSlice(...a),
  ...createMappingDataSlice(...a),
  ...createMappingControlPlaneSlice(...a),
}));

