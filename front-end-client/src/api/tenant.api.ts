import { Firestore, collection, doc, query, onSnapshot, setDoc, deleteDoc, serverTimestamp, deleteField, where, getDoc } from 'firebase/firestore';
import { TenantConfig } from '../types/index';
import { TenantConfigSchema } from '../lib/validation.schemas';

export const subscribeToTenantsAPI = (

  db: Firestore,
  filters: { area?: string; departmentId?: string },
  onData: (tenants: TenantConfig[]) => void,
  onError: (error: Error) => void
) => {
  let q = query(collection(db, 'tenants'));
  if (filters.area) {
    q = query(collection(db, 'tenants'), where('area', '==', filters.area));
  } else if (filters.departmentId) {
    q = query(collection(db, 'tenants'), where('__name__', '==', filters.departmentId));
  }
  
  let unsubscribe: () => void;
  unsubscribe = onSnapshot(q, (snapshot) => {
    const tenants: TenantConfig[] = [];
    snapshot.forEach((docSnap) => {
      tenants.push({ id: docSnap.id, ...docSnap.data() } as TenantConfig);
    });
    onData(tenants);
  }, (error) => {
    unsubscribe();
    onError(error);
  });
  return unsubscribe;
};

export const getTenantConfigAPI = async (db: Firestore, id: string): Promise<TenantConfig | null> => {
  const docRef = doc(db, 'tenants', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as TenantConfig;
  }
  return null;
};

export const saveTenantConfigAPI = async (db: Firestore, tenant: TenantConfig) => {
  const docRef = doc(db, 'tenants', tenant.id);
  const payload = {
    id: tenant.id,
    name: tenant.name,
    area: tenant.area,
    firebaseConfig: tenant.firebaseConfig,
    isActive: tenant.isActive,
    createdAt: tenant.createdAt || Date.now()
  };

  const validatedPayload = TenantConfigSchema.parse(payload);
  
  await setDoc(docRef, {
    ...validatedPayload,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

export const deleteTenantFirebaseConfigAPI = async (db: Firestore, id: string) => {
  const docRef = doc(db, 'tenants', id);
  await setDoc(docRef, {
    firebaseConfig: deleteField(),
    updatedAt: serverTimestamp()
  }, { merge: true });
};

export const deleteTenantConfigAPI = async (db: Firestore, id: string) => {
  const docRef = doc(db, 'tenants', id);
  await deleteDoc(docRef);
};
