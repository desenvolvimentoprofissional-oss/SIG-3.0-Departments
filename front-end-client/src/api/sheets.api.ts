import { z } from 'zod';

const AppendPayloadSchema = z.object({
  spreadsheetUrl: z.string().url(),
  tabName: z.string().min(1),
  idColumn: z.string().min(1),
  idValue: z.string().min(1),
  updates: z.record(z.string(), z.any()),
  values: z.array(z.any()).default([])
});

const SheetsResponseSchema = z.object({
  success: z.boolean().optional(),
  error: z.string().optional(),
  details: z.string().optional(),
  action: z.string().optional()
}).passthrough();

export const appendObservationToSheet = async (
  spreadsheetUrl: string,
  tabName: string,
  idColumn: string,
  idValue: string,
  updates: Record<string, any>
): Promise<void> => {
  const payload = AppendPayloadSchema.parse({
    spreadsheetUrl,
    tabName,
    idColumn,
    idValue,
    updates,
    values: []
  });

  const res = await fetch('/api/sheets/append', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const rawError = await res.json().catch(() => ({}));
    const errorData = SheetsResponseSchema.parse(rawError);
    throw new Error(errorData.error || `Failed to save to Google Sheets: ${res.statusText}`);
  }
  SheetsResponseSchema.parse(await res.json().catch(() => ({})));
};
