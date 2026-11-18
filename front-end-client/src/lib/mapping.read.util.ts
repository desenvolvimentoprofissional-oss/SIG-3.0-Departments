export const extractChunkedData = (snapDocs: any[], collectionName: string, processId: string, legacyArrayName: string): any[] => {
  let allItems: any[] = [];
  snapDocs.forEach(d => {
    const arr = d.data()[collectionName];
    if (Array.isArray(arr)) {
      allItems = allItems.concat(arr);
    } else if (Array.isArray(d.data()[legacyArrayName])) {
       let encodedSafeId = '';
       try { encodedSafeId = encodeURIComponent(processId); } catch(e) {}
       
       if (d.id === processId || d.id === encodedSafeId) {
           allItems = allItems.concat(d.data()[legacyArrayName]);
       }
    }
  });
  return allItems.filter(item => item.relationalId === processId || item.processId === processId);
};

export const filterLatestVotes = (processVotes: any[]): any[] => {
  const latestVotesMap = new Map<string, any>();
  processVotes.forEach(v => {
    const existing = latestVotesMap.get(v.userId);
    if (!existing || new Date(v.date).getTime() > new Date(existing.date).getTime()) {
      latestVotesMap.set(v.userId, v);
    }
  });
  return Array.from(latestVotesMap.values());
};
