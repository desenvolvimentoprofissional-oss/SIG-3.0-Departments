import { z } from "zod";

export const AuthPayloadSchema = z.object({
  id_token: z.string().min(10, "Token is required"),
  tenantId: z.string().optional(),
});


