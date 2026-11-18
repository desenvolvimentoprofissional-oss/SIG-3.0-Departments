import React, { useState, useEffect } from 'react';
import { Webhook } from 'lucide-react';
import { PageMapping } from '../../types/index';
import { useAuthStore } from '../../store/authStore';
import { auth } from '../../api/firebase.client';
import { logger, sanitizeErrorForTelemetry } from '../../lib/logger.util';

interface IntegrationViewProps {
  mapping: PageMapping;
}

export const IntegrationView: React.FC<IntegrationViewProps> = ({ mapping }) => {
  const { user } = useAuthStore();
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const buildUrl = async () => {
      let urlStr = mapping.iframeUrl || '';
      setErrorMsg('');
      
      if (urlStr.includes('drive.google.com/file/d/')) {
        urlStr = urlStr.replace(/\/view.*/, '/preview');
      }

      if (urlStr.includes('docs.google.com/presentation/d/')) {
        urlStr = urlStr.replace(/\/edit.*/, '/embed?rm=minimal');
      }
      
      if (urlStr.includes('airtable.com') && !urlStr.includes('/embed/')) {
        urlStr = urlStr.replace('airtable.com/app', 'airtable.com/embed/app').replace('airtable.com/shr', 'airtable.com/embed/shr');
      }
      
      if (mapping.passUserInfo && user && urlStr) {
        try {
          // sig_token is managed via HttpOnly cookies and internal state.
          // It must not be exposed in the query string.
        } catch (e) {
          logger.error("ERR_JWT_INTEGRATION", sanitizeErrorForTelemetry(e));
          setErrorMsg("Erro ao processar requisição. Falha de infraestrutura.");
        }
      }
      
      setProcessedUrl(urlStr);
    };

    buildUrl();
  }, [mapping.iframeUrl, mapping.passUserInfo, user]);

  return (
    <div className="flex flex-col bg-transparent h-full overflow-hidden">
      <div className="flex-1 min-w-0 p-4 md:p-8 flex flex-col overflow-hidden">
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium animate-in fade-in">
            {errorMsg}
          </div>
        )}
        <div className="flex-1 min-h-0 bg-white rounded-lg shadow-sm border border-[var(--color-border-default)] overflow-hidden flex flex-col">
          {processedUrl ? (
            <iframe 
              src={processedUrl} 
              title={mapping.pageName}
              className="w-full h-full border-0 flex-1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-[var(--color-content-tertiary)] flex-col h-full">
              <Webhook className="w-12 h-12 mb-4 opacity-50 text-[var(--color-brand-main)]" />
              <p>{mapping.iframeUrl ? 'Gerando acesso seguro...' : 'URL do iFrame não configurada para esta integração.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
