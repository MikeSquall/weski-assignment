import { Hotel, SearchParams } from '../types';

export interface IHotelProvider {
  search(params: SearchParams): Promise<Hotel[]>;
}
