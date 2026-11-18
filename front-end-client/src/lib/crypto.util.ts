export function pseudonymizeEmail(email: string): string {
  if (!email) return '';
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  return `***@${parts[1]}`;
}

export function anonymizeCPF(cpf: string): string {
  if (!cpf) return '';
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return cpf;
  return `***.${clean.substring(3,6)}.${clean.substring(6,9)}-**`;
}
