export function filterByMyProcesses(data: any[], show: boolean, userEmail?: string | null): any[] {
  if (!show || !userEmail) return data;
  
  const userEmailLower = userEmail.toLowerCase();
  return data.filter(item => {
    const emailField = item._mapping?.primaryFields?.responsibleEmail;
    return emailField && String(item[emailField] || '').toLowerCase() === userEmailLower;
  });
}
