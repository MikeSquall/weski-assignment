import { describe, it, expect, beforeEach } from 'vitest';
import { useSearchStore } from '../store/searchStore';
import { Hotel } from '../types/hotel';

function makeHotel(code: string, price: number): Hotel {
  return {
    hotelCode: code,
    hotelName: `Hotel ${code}`,
    mainImage: '',
    images: [],
    rating: 3,
    beds: 2,
    skiLiftDistance: '100m',
    cityCenterDistance: '200m',
    priceAfterTax: price,
    priceBeforeTax: price * 0.9,
    groupSize: 2,
  };
}

const initial = {
  skiSite: null,
  groupSize: 2,
  fromDate: '',
  toDate: '',
  hotels: [],
  isLoading: false,
  isSearched: false,
};

describe('searchStore', () => {
  beforeEach(() => {
    useSearchStore.setState(initial);
  });

  it('initialises with correct defaults', () => {
    const s = useSearchStore.getState();
    expect(s.skiSite).toBeNull();
    expect(s.groupSize).toBe(2);
    expect(s.hotels).toEqual([]);
    expect(s.isLoading).toBe(false);
    expect(s.isSearched).toBe(false);
  });

  it('setSkiSite updates skiSite', () => {
    useSearchStore.getState().setSkiSite(3);
    expect(useSearchStore.getState().skiSite).toBe(3);
  });

  it('setGroupSize updates groupSize', () => {
    useSearchStore.getState().setGroupSize(7);
    expect(useSearchStore.getState().groupSize).toBe(7);
  });

  it('addHotel inserts hotels sorted by priceAfterTax ascending', () => {
    const { addHotel } = useSearchStore.getState();
    addHotel(makeHotel('C', 300));
    addHotel(makeHotel('A', 100));
    addHotel(makeHotel('B', 200));

    const prices = useSearchStore.getState().hotels.map((h) => h.priceAfterTax);
    expect(prices).toEqual([100, 200, 300]);
  });

  it('addHotel keeps sort order when inserting a mid-range hotel', () => {
    const { addHotel } = useSearchStore.getState();
    addHotel(makeHotel('A', 100));
    addHotel(makeHotel('C', 300));
    addHotel(makeHotel('B', 200));

    const codes = useSearchStore.getState().hotels.map((h) => h.hotelCode);
    expect(codes).toEqual(['A', 'B', 'C']);
  });

  it('clearResults empties hotels and resets isSearched to false', () => {
    useSearchStore.getState().addHotel(makeHotel('A', 100));
    useSearchStore.getState().setSearched(true);
    useSearchStore.getState().clearResults();

    const s = useSearchStore.getState();
    expect(s.hotels).toEqual([]);
    expect(s.isSearched).toBe(false);
  });

  it('clearResults does not affect isLoading', () => {
    useSearchStore.getState().setLoading(true);
    useSearchStore.getState().clearResults();
    expect(useSearchStore.getState().isLoading).toBe(true);
  });

  it('setLoading toggles isLoading', () => {
    useSearchStore.getState().setLoading(true);
    expect(useSearchStore.getState().isLoading).toBe(true);
    useSearchStore.getState().setLoading(false);
    expect(useSearchStore.getState().isLoading).toBe(false);
  });
});
