import { Firestore, doc, getDoc, setDoc } from 'firebase/firestore';

export const getMetricasDocument = async (db: Firestore, collectionName: string, docName: string) => {
  const docRef = doc(db, collectionName, docName);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

export const saveMetricasDocument = async (db: Firestore, collectionName: string, docName: string, data: any) => {
  const docRef = doc(db, collectionName, docName);
  await setDoc(docRef, data, { merge: true });
};
