import { z } from 'zod';

export const envSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1, "API Key do Firebase é obrigatória."),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1, "Project ID do Firebase é obrigatório."),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  VITE_FIREBASE_APP_ID: z.string().optional(),
});

export function validateEnv() {
  const envVars = {
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  const parsed = envSchema.safeParse(envVars);

  if (!parsed.success) {
    console.error('❌ FALHA DE CONFORMIDADE GRC (PILAR I): Variáveis de ambiente inválidas ou ausentes:', parsed.error.format());
    
    document.body.innerHTML = `
      <div style="font-family: sans-serif; padding: 2rem; background: #020618; color: white; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
        <h1 style="color: #e11d48; margin-bottom: 1rem;">BLOQUEIO DE SEGURANÇA GRC</h1>
        <p style="max-width: 600px; color: #90A1B9; line-height: 1.6;">O sistema detectou a ausência de chaves criptográficas (ex: API Keys do Firebase). Segundo as diretrizes Zero-Trust do Pilar I de arquitetura, fallbacks para credenciais são estritamente vetados. Por favor, adicione os segredos no painel de ambiente.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #051126; border: 1px solid #1D293D; border-radius: 8px; font-family: monospace; font-size: 0.85rem; color: #FFD230;">
          [FAIL-FAST] Execução Abortada
        </div>
      </div>
    `;
    throw new Error("FAIL-FAST GRC (Pilar I): Sec secrets undefined");
  }

  return parsed.data;
}

