import React, { useEffect, useState, useRef } from 'react';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { sanitizeAndVerifyAuthPayload } from '../../lib/auth.util';
import { motion } from 'motion/react';
import { getAuthUrlAPI, getCurrentUserAPI } from '../../api/auth.api';
import { auth } from '../../api/firebase.client';
import { signInWithCustomToken } from 'firebase/auth';

export const LoginForm: React.FC = () => {
  const { login } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const origin = event.origin;
      if (origin !== window.location.origin) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        try {
          const authData = await getCurrentUserAPI();
          if (!authData || !authData.user) {
            throw new Error('Sessão não encontrada no servidor');
          }
          const cleanSession = sanitizeAndVerifyAuthPayload(authData.user);
          if (authData.customToken && auth) {
            await signInWithCustomToken(auth, authData.customToken);
            cleanSession.customToken = authData.customToken;
          }
          login(cleanSession).catch(() => setErrorMsg('Erro ao iniciar a sessão com o banco.'));
        } catch (error) {
          setErrorMsg('Ocorreu um erro ao verificar o seu perfil. Contate o suporte.');
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [login]);

  const handleConnect = async () => {
    setErrorMsg(null);
    try {
      const data = await getAuthUrlAPI();
      
      const urlSchema = z.object({
        url: z.string().url(),
        redirectUri: z.string()
      }).passthrough();
      
      const { url, redirectUri } = urlSchema.parse(data);

      let left = window.screenX + (window.innerWidth / 2);
      let top = window.screenY + (window.innerHeight / 2);
      const width = 450;
      const height = 600;

      if (formRef.current) {
        const rect = formRef.current.getBoundingClientRect();
        left = window.screenX + rect.left + (rect.width / 2) - (width / 2);
        top = window.screenY + (window.outerHeight - height) / 2;
      } else {
        left = window.screenX + window.innerWidth - width - 50;
        top = window.screenY + Math.max(0, (window.innerHeight - height) / 2);
      }
      
      window.open(url, 'google-login', `width=${width},height=${height},left=${left},top=${top}`);
    } catch (error) {
      console.error('[AUTH] - Operation aborted due to network communication infrastructure failure.');
      setErrorMsg('Ocorreu um erro ao inicializar a autenticação.');
    }
  };

  return (
    <motion.div 
      ref={formRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="flex flex-col items-center text-center mb-10">
        <motion.img 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          src="/crasp-logo.png" 
          alt="CRA-SP Logo" 
          className="h-16 w-auto object-contain mb-8" 
        />
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-2xl font-bold text-[var(--color-brand-dark)] tracking-tight mb-2"
        >
          Acesso Institucional
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="text-sm text-[var(--color-content-secondary)]"
        >
          Faça login com sua conta autorizada do<br />
          Google Workspace para continuar.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        className="w-11/12 max-w-[320px] mx-auto"
      >
        <Button
          variant="secondary"
          onClick={handleConnect}
          className="w-full h-12 shadow-sm hover:shadow-md transition-all duration-300 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 font-medium !justify-center rounded-lg"
          type="button"
          icon={(
            <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
        >
          <span className="text-sm">Continuar com Google Workspace</span>
        </Button>
      </motion.div>

      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 bg-[var(--color-status-error)] bg-opacity-10 rounded-md border border-[var(--color-status-error)] text-center text-[var(--color-status-error)] text-xs font-medium"
        >
          {errorMsg}
        </motion.div>
      )}
    </motion.div>
  );
};

