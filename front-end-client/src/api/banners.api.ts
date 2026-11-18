import { Firestore, collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, query, where, Query } from 'firebase/firestore';
import { BannerItem } from '../store/bannersStore';
import { sanitizeForFirestore } from '../lib/sanitize.util';

const buildBannerQuery = (db: Firestore, tenantId: string | null | undefined): Query => {
  if (tenantId === null) {
    return query(collection(db, 'banners'));
  }
  if (tenantId === undefined) {
    return query(collection(db, 'banners'), where('createdByDepartmentId', '==', null));
  }
  return query(collection(db, 'banners'), where('createdByDepartmentId', '==', tenantId));
};

const sortBanners = (banners: BannerItem[]): BannerItem[] => {
  return banners.sort((a, b) => {
    const pinDiff = Number(!!b.isPinned) - Number(!!a.isPinned);
    if (pinDiff !== 0) return pinDiff;
    const orderDiff = (a.orderIndex || 0) - (b.orderIndex || 0);
    if (orderDiff !== 0) return orderDiff;
    return b.createdAt - a.createdAt;
  });
};

export const subscribeToBannerAPI = (
  db: Firestore,
  tenantId: string | null | undefined,
  onData: (items: BannerItem[]) => void,
  onError: (error: Error) => void
) => {
  const q = buildBannerQuery(db, tenantId);
  let unsubscribe: () => void;
  unsubscribe = onSnapshot(q, (snapshot) => {
    const fetchedItems: BannerItem[] = [];
    snapshot.forEach((subDoc) => {
      fetchedItems.push(subDoc.data() as BannerItem);
    });
    onData(sortBanners(fetchedItems));
  }, (error) => {
    unsubscribe();
    onError(error);
  });
  return unsubscribe;
};

export const addBannerItemAPI = async (db: Firestore, item: BannerItem) => {
  const newDocRef = doc(collection(db, 'banners'));
  item.id = newDocRef.id;
  await setDoc(newDocRef, sanitizeForFirestore(item));
  return item;
};

export const updateBannerItemAPI = async (db: Firestore, id: string, update: Partial<BannerItem>) => {
  await updateDoc(doc(db, 'banners', id), sanitizeForFirestore(update));
};

export const removeBannerItemAPI = async (db: Firestore, id: string) => {
  await deleteDoc(doc(db, 'banners', id));
};
