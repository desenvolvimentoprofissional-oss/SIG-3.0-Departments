import { Firestore, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

export interface PageFeedbackData {
  upvotes: number;
  downvotes: number;
}

export const getPageFeedbackAPI = async (db: Firestore, pageId: string): Promise<PageFeedbackData> => {
  const statsRef = doc(db, 'page_feedbacks', pageId);
  const statsSnap = await getDoc(statsRef);
  if (statsSnap.exists()) {
    const data = statsSnap.data();
    return {
      upvotes: data.upvotes || 0,
      downvotes: data.downvotes || 0,
    };
  }
  return { upvotes: 0, downvotes: 0 };
};

export const getUserVoteAPI = async (db: Firestore, pageId: string, userId: string): Promise<'up' | 'down' | null> => {
  const userVoteRef = doc(db, 'page_feedbacks', pageId, 'votes', userId);
  const userVoteSnap = await getDoc(userVoteRef);
  if (userVoteSnap.exists()) {
    return userVoteSnap.data().type as 'up' | 'down';
  }
  return null;
};

export const submitVoteAPI = async (
  db: Firestore, 
  pageId: string, 
  userId: string, 
  voteType: 'up' | 'down', 
  previousVote: 'up' | 'down' | null
): Promise<void> => {
  const statsRef = doc(db, 'page_feedbacks', pageId);
  const userVoteRef = doc(db, 'page_feedbacks', pageId, 'votes', userId);

  const statsSnap = await getDoc(statsRef);
  if (!statsSnap.exists()) {
    await setDoc(statsRef, { upvotes: 0, downvotes: 0 });
  }

  const updates: any = {};
  if (previousVote === voteType) {

    updates[`${voteType}votes`] = increment(-1);
    await updateDoc(statsRef, updates);
    await setDoc(userVoteRef, { type: null });
  } else {

    updates[`${voteType}votes`] = increment(1);
    if (previousVote) {
      updates[`${previousVote}votes`] = increment(-1);
    }
    await updateDoc(statsRef, updates);
    await setDoc(userVoteRef, { type: voteType, timestamp: new Date() });
  }
};
