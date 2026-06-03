import { Hotel, SearchParams } from '../types';
import { IHotelProvider } from '../providers/IHotelProvider';

export class SearchService {
  constructor(private readonly providers: IHotelProvider[]) {}

  async search(
    params: SearchParams,
    onHotel: (hotel: Hotel) => void
  ): Promise<void> {
    const groupSizes = [
      params.groupSize,
      params.groupSize + 1,
      params.groupSize + 2,
    ].filter((s) => s <= 10);

    const requests = this.providers.flatMap((provider) =>
      groupSizes.map((size) =>
        provider
          .search({ ...params, groupSize: size })
          .then((hotels) => hotels.forEach(onHotel))
          .catch((err) =>
            console.error(`[SearchService] Provider error for group size ${size}:`, err)
          )
      )
    );

    await Promise.allSettled(requests);
  }
}
