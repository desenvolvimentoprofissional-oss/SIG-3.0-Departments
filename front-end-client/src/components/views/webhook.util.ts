import { z } from 'zod';

export const WebhookResponseSchema = z.object({
  success: z.boolean().optional(),
  error: z.string().optional()
}).passthrough();

export const handleWebhookResponse = async (response: Response): Promise<void> => {
  if (response.type === 'opaque') return;

  if (!response.ok) {
    const errData = WebhookResponseSchema.safeParse(await response.json().catch(() => ({})));
    throw new Error(errData.success && errData.data.error ? errData.data.error : `HTTP ${response.status}: Script returned an error.`);
  }

  WebhookResponseSchema.safeParse(await response.json().catch(() => ({})));
};
