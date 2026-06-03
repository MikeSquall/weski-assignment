import { z } from 'zod';

const imageSchema = z.object({
  URL: z.string(),
  MainImage: z.string().optional(),
});

const hotelSchema = z.object({
  HotelCode: z.string(),
  HotelName: z.string(),
  HotelDescriptiveContent: z.object({
    Images: z.array(imageSchema),
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
    accommodations: z.array(hotelSchema),
  }),
});
