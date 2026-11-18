import React, { useState } from 'react';
import { z } from 'zod';
import { Play, Loader2, CheckCircle2, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { logger, sanitizeErrorForTelemetry } from '../../lib/logger.util';
import { handleWebhookResponse } from './webhook.util';

const CustomActionEnvelopeSchema = z.object({
  actionId: z.any(),
  actionLabel: z.any(),
  functionName: z.any(),
  recordId: z.any(),
  recordData: z.record(z.string(), z.any())
}).passthrough();

const WebhookExecutionSchema = z.object({
  scriptUrl: z.string().url(),
  payloadString: z.string()
});

interface MappedPageCustomActionsProps {
  selectedItem: any;
}

export const MappedPageCustomActions: React.FC<MappedPageCustomActionsProps> = ({ selectedItem }) => {
  const customActions = selectedItem._colConfig?.components?.customActions || selectedItem._colConfig?.customActions || selectedItem._mapping?.viewConfig?.components?.customActions;

  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});
  const [actionStatus, setActionStatus] = useState<Record<string, 'success' | 'error' | null>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCustomActionsValid = customActions && Array.isArray(customActions) && customActions.length > 0;
  if (!isCustomActionsValid) return null;

  const preparePayload = (action: any, cleanRecordData: any) => {
    return WebhookExecutionSchema.parse({
      scriptUrl: action.scriptUrl,
      payloadString: JSON.stringify(CustomActionEnvelopeSchema.parse({
        actionId: action.id,
        actionLabel: action.label,
        functionName: action.functionName,
        recordId: selectedItem.id,
        recordData: cleanRecordData
      }))
    });
  };

  const handleActionClick = async (action: any) => {
    if (!action.scriptUrl) return;

    setLoadingActions(prev => ({ ...prev, [action.id]: true }));
    setActionStatus(prev => ({ ...prev, [action.id]: null }));
    setErrorMessage(null);

    try {
      const { _colConfig, _mapping, _collection, ...cleanRecordData } = selectedItem;
      const requestPayload = preparePayload(action, cleanRecordData);

      console.log(`[Webhook - START] Sending POST via server to: ${action.scriptUrl}`);
      
      const response = await fetch('/api/webhook/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
        credentials: 'include'
      });

      await handleWebhookResponse(response);

      setActionStatus(prev => ({ ...prev, [action.id]: 'success' }));
      
    } catch (error: any) {
      logger.error('ERR_WEBHOOK_EXEC', sanitizeErrorForTelemetry(error));
      setErrorMessage("Erro ao processar requisição. Falha de infraestrutura.");
      setActionStatus(prev => ({ ...prev, [action.id]: 'error' }));
    } finally {
      setLoadingActions(prev => ({ ...prev, [action.id]: false }));
      
      setTimeout(() => {
        setActionStatus(prev => {
          return prev[action.id] === 'success' ? { ...prev, [action.id]: null } : prev;
        });
      }, 8000);
    }
  };

  return (
    <div>
      <h4 className="text-xs uppercase font-bold text-[var(--color-content-secondary)] mb-3 pt-2 border-t border-[var(--color-border-default)] flex items-center mt-2">
        <Play size={14} className="mr-1" /> Ações Customizadas
      </h4>

      {errorMessage && (
        <div className="mb-3 p-4 bg-red-50 text-red-900 text-sm rounded border border-red-200 shadow-sm">
          <div className="font-bold flex items-center mb-2 text-red-700">
            <AlertCircle size={16} className="mr-2" /> 
            Falha na Comunicação com o Apps Script
          </div>
          
          <div className="mb-3 font-mono bg-white p-2 rounded border border-red-100 text-xs">
            {errorMessage.includes('Failed to fetch') 
              ? 'Erro: "Failed to fetch" (Bloqueio de CORS ou Erro Interno 500 no Apps Script)' 
              : errorMessage}
          </div>

          <div className="text-red-800 space-y-2">
            <p className="font-semibold text-xs uppercase tracking-wider">Como corrigir no Google Apps Script:</p>
            
            <ol className="list-decimal pl-5 space-y-2 text-xs">
              <li>
                <strong>O script quebrou durante a execução:</strong> Quando o Apps Script dá erro (como <i>"Cannot read properties of undefined"</i>), o Google retorna uma página de erro HTML <b>sem headers CORS</b>. O navegador bloqueia essa página e exibe "Failed to fetch".
              </li>
              <li>
                <strong>Veja o erro real:</strong> Vá no painel do Apps Script, clique no menu lateral <b>"Execuções" (Registro de Execução)</b> e veja a mensagem de erro exata que causou a "Falha".
              </li>
              <li>
                <strong>Se o erro for `postData` undefined:</strong> Isso acontece se a versão implantada for antiga. <b>Sempre que alterar o código, você DEVE criar uma NOVA implantação.</b>
                <br/>Vá em <i>Implantar &gt; Nova Implantação</i> (Nunca use "Gerenciar" para salvar código novo sem criar versão).
              </li>
              <li>
                <strong>Código à prova de falhas:</strong> Atualize seu <code>doPost</code> para suportar fallback:
                <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 overflow-x-auto">
{`function doPost(e) {
  try {
    var data = e.postData ? e.postData.contents : "{}";
    var payload = JSON.parse(data);
    
    return ContentService.createTextOutput(JSON.stringify({"status": "sucesso"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({"erro": err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`}
                </pre>
              </li>
            </ol>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {customActions.map((action: any) => (
          <Button
            key={action.id}
            onClick={() => handleActionClick(action)}
            disabled={loadingActions[action.id]}
            className="w-full justify-center"
            variant="primary"
          >
            {loadingActions[action.id] ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" /> Enviando...
              </>
            ) : actionStatus[action.id] === 'success' ? (
              <>
                <CheckCircle2 size={16} className="mr-2 text-green-300" /> Ação Concluída
              </>
            ) : actionStatus[action.id] === 'error' ? (
              <>
                <AlertCircle size={16} className="mr-2 text-red-300" /> Erro na Execução
              </>
            ) : (
              <>
                <Play size={16} className="mr-2" /> {action.label || 'Executar Ação'}
              </>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

