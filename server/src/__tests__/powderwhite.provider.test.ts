import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PowderWhiteProvider } from '../providers/powderwhite/PowderWhiteProvider';
import { SearchParams } from '../types';

const baseAccommodation = {
  HotelCode: 'TEST001',
  HotelName: 'Test Chalet',
  HotelDescriptiveContent: {
    Images: [
      { URL: 'https://example.com/img1.jpg' },
      { URL: 'https://example.com/img2.jpg', MainImage: 'True' },
    ],
  },
  HotelInfo: {
    Position: {
      Latitude: '45.0',
      Longitude: '6.0',
      Distances: [
        { type: 'ski_lift', distance: '200m' },
        { type: 'city_center', distance: '150m' },
      ],
    },
    Rating: '4',
    Beds: '3',
  },
  PricesInfo: { AmountAfterTax: '350.00', AmountBeforeTax: '320.00' },
};

function mockFetch(body: unknown, ok = true) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 500,
      json: () => Promise.resolve(body),
    })
  );
}

const params: SearchParams = {
  skiSite: 4,
  fromDate: '12/01/2025',
  toDate: '12/12/2025',
  groupSize: 2,
};

describe('PowderWhiteProvider', () => {
  let provider: PowderWhiteProvider;

  beforeEach(() => {
    provider = new PowderWhiteProvider();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps API response to Hotel shape', async () => {
    mockFetch({
      statusCode: 200,
      body: { success: 'true', accommodations: [baseAccommodation] },
    });

    const hotels = await provider.search(params);

    expect(hotels).toHaveLength(1);
    const [hotel] = hotels;
    expect(hotel.hotelCode).toBe('TEST001');
    expect(hotel.hotelName).toBe('Test Chalet');
    expect(hotel.rating).toBe(4);
    expect(hotel.beds).toBe(3);
    expect(hotel.skiLiftDistance).toBe('200m');
    expect(hotel.cityCenterDistance).toBe('150m');
    expect(hotel.priceAfterTax).toBe(350);
    expect(hotel.priceBeforeTax).toBe(320);
    expect(hotel.groupSize).toBe(2);
  });

  it('picks the image with MainImage: True as main image', async () => {
    mockFetch({
      statusCode: 200,
      body: { success: 'true', accommodations: [baseAccommodation] },
    });

    const [hotel] = await provider.search(params);
    expect(hotel.mainImage).toBe('https://example.com/img2.jpg');
    expect(hotel.images).toHaveLength(2);
  });

  it('falls back to first image when no MainImage flag', async () => {
    const noMain = {
      ...baseAccommodation,
      HotelDescriptiveContent: {
        Images: [{ URL: 'https://example.com/first.jpg' }, { URL: 'https://example.com/second.jpg' }],
      },
    };
    mockFetch({ statusCode: 200, body: { success: 'true', accommodations: [noMain] } });

    const [hotel] = await provider.search(params);
    expect(hotel.mainImage).toBe('https://example.com/first.jpg');
  });

  it('sends correctly shaped request body to upstream API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({ statusCode: 200, body: { success: 'true', accommodations: [] } }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await provider.search({ ...params, skiSite: 1, groupSize: 5 });

    const [_url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(options.body as string);
    expect(body.query.ski_site).toBe(1);
    expect(body.query.group_size).toBe(5);
    expect(body.query.from_date).toBe('12/01/2025');
    expect(body.query.to_date).toBe('12/12/2025');
  });

  it('throws when upstream API returns non-OK status', async () => {
    mockFetch(null, false);
    await expect(provider.search(params)).rejects.toThrow('500');
  });

  it('returns empty array when accommodations list is empty', async () => {
    mockFetch({ statusCode: 200, body: { success: 'true', accommodations: [] } });
    const hotels = await provider.search(params);
    expect(hotels).toEqual([]);
  });
});
