import { z } from 'zod';

export const wsSearchMessageSchema = z.object({
  type: z.literal('search'),
  payload: z.object({
    skiSite: z.number().int().min(1).max(5),
    fromDate: z.string().min(1),
    toDate: z.string().min(1),
    groupSize: z.number().int().min(1).max(10),
  }),
});

