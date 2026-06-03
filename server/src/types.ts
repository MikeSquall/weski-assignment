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

export interface SearchParams {
  skiSite: number;
  fromDate: string;
  toDate: string;
  groupSize: number;
}

export type WsServerMessage =
  | { type: 'hotel'; payload: Hotel }
  | { type: 'done' }
  | { type: 'error'; payload: string };

export type WsClientMessage = {
  type: 'search';
  payload: SearchParams;
};
