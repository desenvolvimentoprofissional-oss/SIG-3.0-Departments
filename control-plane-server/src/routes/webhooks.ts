import express from 'express';
import { z } from 'zod';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const webhookRouter = express.Router();

const AppendPayloadSchema = z.object({
  spreadsheetUrl: z.string().url().startsWith('https://script.google.com/'),
  tabName: z.string().optional(),
  idColumn: z.string().optional(),
  idValue: z.string().optional(),
  updates: z.record(z.string(), z.any()).optional(),
  values: z.array(z.any()).optional()
});

const sendWebhookRequest = async (payload: z.infer<typeof AppendPayloadSchema>) => {
  const response = await fetch(payload.spreadsheetUrl, {
    method: 'POST',
    body: JSON.stringify({
      tabName: payload.tabName || 'Página1',
      idColumn: payload.idColumn,
      idValue: payload.idValue,
      updates: payload.updates,
      values: payload.values
    })
  });
  if (!response.ok) {
    throw new Error(`Apps Script Webhook returned status ${response.status}`);
  }
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'Unknown error';
};

const isWebhookResponseValid = (response: Response): boolean => {
  if (response.ok) return true;
  return response.type === 'opaque';
};

webhookRouter.post('/sheets/append', requireAuth, async (req, res) => {
  try {
    const payload = AppendPayloadSchema.parse(req.body);
    await sendWebhookRequest(payload);
    res.json({ success: true, action: 'processed_via_webhook' });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    console.error('Error with Apps Script Webhook:', msg);
    res.status(500).json({ error: 'Failed to communicate with Spreadsheet Webhook (Apps Script)', details: msg });
  }
});

const WebhookExecuteSchema = z.object({
  scriptUrl: z.string().url().startsWith('https://script.google.com/'),
  payloadString: z.string()
});

webhookRouter.post('/webhook/execute', requireAuth, async (req, res) => {
  try {
    const { scriptUrl, payloadString } = WebhookExecuteSchema.parse(req.body);
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: payloadString
    });
    if (!isWebhookResponseValid(response)) {
      return res.status(response.status).json({ error: `Webhook returned HTTP ${response.status}` });
    }
    res.json({ success: true });
  } catch (error: unknown) {
    console.error('Error executing webhook on server:', getErrorMessage(error));
    res.status(500).json({ error: 'Failed to execute custom action webhook via server' });
  }
});
