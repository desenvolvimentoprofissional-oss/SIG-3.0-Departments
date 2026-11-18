import { Firestore, collection, doc, query, onSnapshot, getDoc, getDocs, documentId, where } from 'firebase/firestore';
import { PageMapping } from '../types/index';
import { extractChunkedData, filterLatestVotes } from '../lib/mapping.read.util';

export const subscribeToMappingsAPI = (
  db: Firestore,
  onData: (mappings: PageMapping[]) => void,
  onError: (error: Error) => void
) => {
  const q = query(collection(db, 'system_page_mappings'));
  let unsubscribe: () => void;
  unsubscribe = onSnapshot(q, (snapshot) => {
    const mappings: PageMapping[] = [];
    snapshot.forEach((docSnap) => {
      mappings.push({ id: docSnap.id, ...docSnap.data() } as PageMapping);
    });
    onData(mappings);
  }, (error) => {
    unsubscribe();
    onError(error);
  });
  return unsubscribe;
};

const listenToExactDocument = (
  db: Firestore,
  collectionName: string,
  docName: string,
  onData: (data: any[]) => void,
  onError: (error: Error) => void
) => {
  const docRef = doc(db, collectionName, docName);
  let unsub: () => void;
  unsub = onSnapshot(docRef, (docSnap) => {
    onData(docSnap.exists() ? [{ _id: docSnap.id, ...docSnap.data() }] : []);
  }, (error) => {
    unsub();
    onError(error);
  });
  return unsub;
};

const getPrefixQuery = (db: Firestore, collectionName: string, docName: string) => {
  return query(
    collection(db, collectionName),
    where(documentId(), '>=', docName),
    where(documentId(), '<=', docName + '\uf8ff')
  );
};

const listenToCollectionQuery = (
  db: Firestore,
  collectionName: string,
  docName: string | undefined,
  docNameType: "EXACT" | "PREFIX" | undefined,
  onData: (data: any[]) => void,
  onError: (error: Error) => void
) => {
  const q = (docName && docNameType === "PREFIX") 
    ? getPrefixQuery(db, collectionName, docName) 
    : query(collection(db, collectionName));

  let unsub: () => void;
  unsub = onSnapshot(q, (snapshot) => {
    onData(snapshot.docs.map(d => ({ _id: d.id, ...d.data() })));
  }, (error) => {
    unsub();
    onError(error);
  });
  return unsub;
};

export const listenToMappingCollectionsAPI = (
  db: Firestore,
  collectionName: string,
  onData: (data: any[]) => void,
  onError: (error: Error) => void,
  docName?: string,
  docNameType?: "EXACT" | "PREFIX"
) => {
  if (docName && docNameType === "EXACT") {
    return listenToExactDocument(db, collectionName, docName, onData, onError);
  }
  return listenToCollectionQuery(db, collectionName, docName, docNameType, onData, onError);
};

export const getMeuControleDoc = async (db: Firestore, collectionName: string, processId: string) => {
  const fvCollection = `fv_${collectionName}`;
  const foCollection = `fo_${collectionName}`;
  
  const [fvSnap, foSnap] = await Promise.all([
    getDocs(collection(db, fvCollection)),
    getDocs(collection(db, foCollection))
  ]);
  
  const observations = extractChunkedData(foSnap.docs, foCollection, processId, 'observations');
  const allVotes = extractChunkedData(fvSnap.docs, fvCollection, processId, 'votes');
  const votes = filterLatestVotes(allVotes);
  
  return { observations, votes };
};

export const subscribeToCollectionUpdateAPI = (
  db: Firestore,
  collectionName: string,
  onData: (data: any | null) => void,
  onError: (error: Error) => void
) => {
  const docRef = doc(db, collectionName, 'atualizacao');
  let unsubscribe: () => void;
  unsubscribe = onSnapshot(docRef, (docSnap) => {
    onData(docSnap.exists() ? docSnap.data() : null);
  }, (error) => {
    unsubscribe();
    onError(error);
  });
  return unsubscribe;
};
