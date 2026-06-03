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

const apiImageSchema = z.object({
  URL: z.string(),
  MainImage: z.string().optional(),
});

const apiHotelSchema = z.object({
  HotelCode: z.string(),
  HotelName: z.string(),
  HotelDescriptiveContent: z.object({
    Images: z.array(apiImageSchema),
  }),
  HotelInfo: z.object({
    Position: z.object({
      Latitude: z.string(),
      Longitude: z.string(),
      Distances: z.array(z.object({ type: z.string(), distance: z.string() })),
    }),
    Rating: z.string(),
    Beds: z.string(),
  }),
  PricesInfo: z.object({
    AmountAfterTax: z.string(),
    AmountBeforeTax: z.string(),
  }),
});

export const apiResponseSchema = z.object({
  statusCode: z.number(),
  body: z.object({
    success: z.string(),
    accommodations: z.array(apiHotelSchema),
  }),
});
