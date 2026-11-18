import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase.client';

export const uploadImageAPI = async (file: File, folder: string): Promise<string> => {
  if (!storage) throw new Error('Storage is not initialized');
  const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};
