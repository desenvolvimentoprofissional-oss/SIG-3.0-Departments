import { create } from 'zustand';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { getAuth, inMemoryPersistence, setPersistence } from 'firebase/auth';
import { TenantConfig } from '../types/index';

import { centralDb } from '../api/firebase.client';

interface ConnectionState {
  apps: Record<string, FirebaseApp>;
  databases: Record<string, Firestore>;
  centralDb: Firestore;
  getTenantApp: (tenant: TenantConfig) => FirebaseApp;
  getTenantFirestore: (tenant: TenantConfig) => Firestore;
}

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  apps: {},
  databases: {},
  centralDb: centralDb,
  
  getTenantApp: (tenant: TenantConfig) => {
    const { apps } = get();
    if (apps[tenant.id]) return apps[tenant.id];

    const appName = `silo_tenant_${tenant.id}`;
    const existingApps = getApps();
    let app = existingApps.find(a => a.name === appName);
    
    if (!app) {
      app = initializeApp(tenant.firebaseConfig, appName);
      const auth = getAuth(app);
      setPersistence(auth, inMemoryPersistence).catch(() => console.error("[AUTH] - Operation aborted due to communication failure or infrastructure response."));
    }
    
    set((state) => ({ apps: { ...state.apps, [tenant.id]: app! } }));
    return app;
  },
  
  getTenantFirestore: (tenant: TenantConfig) => {
    const { databases, getTenantApp } = get();
    if (databases[tenant.id]) return databases[tenant.id];

    const app = getTenantApp(tenant);
    const db = getFirestore(app);
    
    set((state) => ({ databases: { ...state.databases, [tenant.id]: db } }));
    return db;
  }
}));
