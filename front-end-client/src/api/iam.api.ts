import { Firestore, collection, doc, updateDoc, onSnapshot, addDoc, query, where, or } from 'firebase/firestore';
import { UserSessionProfile } from '../types/index';
import { UserSessionProfileSchema } from '../lib/validation.schemas';

export const addUserAPI = async (
  db: Firestore,
  user: Partial<UserSessionProfile>
) => {
  const usersRef = collection(db, 'users');
  const payload = {
    ...user,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  const validatedPayload = UserSessionProfileSchema.partial().parse(payload);
  await addDoc(usersRef, validatedPayload);
};

export const subscribeToUsersAPI = (
  db: Firestore,
  tenantId: string | null | undefined,
  onData: (users: UserSessionProfile[]) => void,
  onError: (error: Error) => void
) => {
  const q = query(collection(db, 'users'));
    
  let unsubscribe: () => void;
  unsubscribe = onSnapshot(q, 
    (snapshot) => {
      const usersData = snapshot.docs.map(d => ({
        uid: d.id,
        ...d.data()
      } as UserSessionProfile));
      onData(usersData);
    }, 
    (error) => {
      unsubscribe();
      onError(error);
    }
  );
  return unsubscribe;
};

export const updateUserAPI = async (
  db: Firestore, 
  uid: string, 
  updates: Partial<UserSessionProfile>
) => {
  const userRef = doc(db, 'users', uid);
  const payload = {
    ...updates,
    updatedAt: Date.now()
  };
  
  const validatedPayload = UserSessionProfileSchema.partial().parse(payload);
  
  await updateDoc(userRef, validatedPayload);
};
