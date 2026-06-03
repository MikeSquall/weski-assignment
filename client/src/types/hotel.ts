export interface Hotel {
  hotelCode: string;
  hotelName: string;
  mainImage: string;
  images: string[];
  rating: number;
  beds: number;
  skiLiftDistance: string;
  cityCenterDistance: string;
  priceAfterTax: number;
  priceBeforeTax: number;
  groupSize: number;
}

export const SKI_RESORTS = [
  { id: 1, name: 'Val Thorens' },
  { id: 2, name: 'Courchevel' },
  { id: 3, name: 'Tignes' },
  { id: 4, name: 'La Plagne' },
  { id: 5, name: 'Chamonix' },
] as const;
