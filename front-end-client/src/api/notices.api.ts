import { Firestore, collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot, query, where } from 'firebase/firestore';
import { sanitizeForFirestore } from '../lib/sanitize.util';

export const subscribeToNoticesAPI = (
  db: Firestore,
  tenantId: string | null | undefined,
  onData: (data: any[]) => void,
  onError: (error: Error) => void
) => {
  let unsubscribe: (() => void) | null = null;
  
  const q = tenantId 
    ? query(collection(db, 'avisos'), where('tenantId', '==', tenantId))
    : query(collection(db, 'avisos'));
    
  unsubscribe = onSnapshot(q, (snapshot) => {
    const fetchedNotices: any[] = [];
    snapshot.forEach((doc) => {
      fetchedNotices.push(doc.data());
    });
    onData(fetchedNotices);
  }, (error) => { 
    if (unsubscribe) unsubscribe();
    onError(error);
  });

  return unsubscribe;
};

export const addNoticeAPI = async (db: Firestore, notice: any) => {
  const newDocRef = doc(collection(db, 'avisos'));
  const newNotice = { ...notice, id: newDocRef.id };
  await setDoc(newDocRef, sanitizeForFirestore(newNotice));
  return newNotice;
};

export const removeNoticeAPI = async (db: Firestore, id: string) => {
  await deleteDoc(doc(db, 'avisos', id));
};

export const updateNoticeAPI = async (db: Firestore, id: string, update: any) => {
  await updateDoc(doc(db, 'avisos', id), sanitizeForFirestore(update));
};
