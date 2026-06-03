import { describe, it, expect } from 'vitest';
import { aggregateHotels } from '../utils/aggregateHotels';
import { Hotel } from '../types/hotel';

function makeHotel(code: string, groupSize: number, price: number): Hotel {
  return {
    hotelCode: code,
    hotelName: `Hotel ${code}`,
    mainImage: 'https://example.com/img.jpg',
    images: [],
    rating: 3,
    beds: groupSize,
    skiLiftDistance: '100m',
    cityCenterDistance: '200m',
    priceAfterTax: price,
    priceBeforeTax: price * 0.9,
    groupSize,
  };
}

describe('aggregateHotels', () => {
  it('returns an empty array for empty input', () => {
    expect(aggregateHotels([])).toEqual([]);
  });

  it('groups records with the same hotelCode into one entry', () => {
    const hotels = [
      makeHotel('A', 2, 200),
      makeHotel('A', 3, 220),
      makeHotel('A', 4, 250),
    ];
    const result = aggregateHotels(hotels);
    expect(result).toHaveLength(1);
    expect(result[0].options).toHaveLength(3);
  });

  it('keeps distinct hotels as separate entries', () => {
    const hotels = [makeHotel('A', 2, 200), makeHotel('B', 2, 300)];
    expect(aggregateHotels(hotels)).toHaveLength(2);
  });

  it('sorts options within a hotel by groupSize ascending', () => {
    const hotels = [makeHotel('A', 4, 250), makeHotel('A', 2, 200), makeHotel('A', 3, 220)];
    const [hotel] = aggregateHotels(hotels);
    expect(hotel.options.map((o) => o.groupSize)).toEqual([2, 3, 4]);
  });

  it('sets lowestPrice to the minimum priceAfterTax across options', () => {
    const hotels = [makeHotel('A', 2, 300), makeHotel('A', 3, 200), makeHotel('A', 4, 250)];
    const [hotel] = aggregateHotels(hotels);
    expect(hotel.lowestPrice).toBe(200);
  });

  it('sorts aggregated hotels by lowestPrice ascending', () => {
    const hotels = [
      makeHotel('C', 2, 500),
      makeHotel('A', 2, 100),
      makeHotel('B', 2, 300),
    ];
    const result = aggregateHotels(hotels);
    expect(result.map((h) => h.hotelCode)).toEqual(['A', 'B', 'C']);
  });

  it('carries over hotel metadata from the first occurrence', () => {
    const hotels = [makeHotel('A', 2, 200), makeHotel('A', 3, 220)];
    const [hotel] = aggregateHotels(hotels);
    expect(hotel.hotelCode).toBe('A');
    expect(hotel.hotelName).toBe('Hotel A');
    expect(hotel.skiLiftDistance).toBe('100m');
  });

  it('handles a single hotel with one option', () => {
    const [hotel] = aggregateHotels([makeHotel('A', 2, 150)]);
    expect(hotel.options).toHaveLength(1);
    expect(hotel.lowestPrice).toBe(150);
  });

  it('re-sorts hotels correctly when lowestPrice changes mid-stream', () => {
    // Simulate arriving in streaming order: B first (high price), then A cheaper option
    const hotels = [
      makeHotel('B', 2, 300),
      makeHotel('A', 2, 200),
      makeHotel('A', 3, 100), // cheapens A below B
    ];
    const result = aggregateHotels(hotels);
    expect(result[0].hotelCode).toBe('A');
    expect(result[0].lowestPrice).toBe(100);
  });
});
