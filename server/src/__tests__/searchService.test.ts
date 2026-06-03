import { describe, it, expect, vi } from 'vitest';
import { SearchService } from '../services/searchService';
import { IHotelProvider } from '../providers/IHotelProvider';
import { Hotel, SearchParams } from '../types';

function makeHotel(code: string, groupSize: number): Hotel {
  return {
    hotelCode: code,
    hotelName: `Hotel ${code}`,
    mainImage: '',
    images: [],
    rating: 3,
    beds: groupSize,
    skiLiftDistance: '100m',
    cityCenterDistance: '200m',
    priceAfterTax: 100,
    priceBeforeTax: 90,
    groupSize,
  };
}

const baseParams: SearchParams = {
  skiSite: 4,
  fromDate: '12/01/2025',
  toDate: '12/12/2025',
  groupSize: 2,
};

describe('SearchService', () => {
  it('calls provider for N, N+1, and N+2 group sizes', async () => {
    const searchMock = vi.fn().mockResolvedValue([]);
    const service = new SearchService([{ search: searchMock }]);

    await service.search(baseParams, vi.fn());

    expect(searchMock).toHaveBeenCalledTimes(3);
    const sizes = searchMock.mock.calls.map(([p]: [SearchParams]) => p.groupSize);
    expect(sizes).toContain(2);
    expect(sizes).toContain(3);
    expect(sizes).toContain(4);
  });

  it('caps group sizes at 10', async () => {
    const searchMock = vi.fn().mockResolvedValue([]);
    const service = new SearchService([{ search: searchMock }]);

    await service.search({ ...baseParams, groupSize: 9 }, vi.fn());

    const sizes = searchMock.mock.calls.map(([p]: [SearchParams]) => p.groupSize);
    expect(sizes).toEqual([9, 10]);
    expect(sizes).not.toContain(11);
  });

  it('calls onHotel for every hotel returned across all group sizes', async () => {
    const provider: IHotelProvider = {
      search: vi.fn().mockResolvedValue([makeHotel('A', 2), makeHotel('B', 2)]),
    };
    const onHotel = vi.fn();
    await new SearchService([provider]).search(baseParams, onHotel);

    // 3 group sizes × 2 hotels = 6 callback invocations
    expect(onHotel).toHaveBeenCalledTimes(6);
  });

  it('keeps delivering results from other sizes when one request fails', async () => {
    const searchMock = vi.fn()
      .mockRejectedValueOnce(new Error('upstream error'))
      .mockResolvedValue([makeHotel('A', 3)]);
    const onHotel = vi.fn();

    await new SearchService([{ search: searchMock }]).search(baseParams, onHotel);

    // First call fails; 2 remaining each return 1 hotel
    expect(onHotel).toHaveBeenCalledTimes(2);
  });

  it('fans out across multiple registered providers', async () => {
    const mockA = vi.fn().mockResolvedValue([makeHotel('A', 2)]);
    const mockB = vi.fn().mockResolvedValue([makeHotel('B', 2)]);
    const onHotel = vi.fn();

    await new SearchService([{ search: mockA }, { search: mockB }]).search(baseParams, onHotel);

    expect(mockA).toHaveBeenCalled();
    expect(mockB).toHaveBeenCalled();
    // 2 providers × 3 group sizes × 1 hotel = 6
    expect(onHotel).toHaveBeenCalledTimes(6);
  });

  it('resolves without calling onHotel when provider returns empty', async () => {
    const provider: IHotelProvider = { search: vi.fn().mockResolvedValue([]) };
    const onHotel = vi.fn();

    await new SearchService([provider]).search(baseParams, onHotel);

    expect(onHotel).not.toHaveBeenCalled();
  });
});
