import { Hotel, AggregatedHotel } from '../types/hotel';

export function aggregateHotels(hotels: Hotel[]): AggregatedHotel[] {
  const map = new Map<string, AggregatedHotel>();

  for (const hotel of hotels) {
    if (!map.has(hotel.hotelCode)) {
      map.set(hotel.hotelCode, {
        hotelCode: hotel.hotelCode,
        hotelName: hotel.hotelName,
        mainImage: hotel.mainImage,
        images: hotel.images,
        rating: hotel.rating,
        skiLiftDistance: hotel.skiLiftDistance,
        cityCenterDistance: hotel.cityCenterDistance,
        options: [],
        lowestPrice: Infinity,
      });
    }

    const agg = map.get(hotel.hotelCode)!;
    agg.options.push({
      groupSize: hotel.groupSize,
      beds: hotel.beds,
      priceAfterTax: hotel.priceAfterTax,
      priceBeforeTax: hotel.priceBeforeTax,
    });
    if (hotel.priceAfterTax < agg.lowestPrice) {
      agg.lowestPrice = hotel.priceAfterTax;
    }
  }

  for (const agg of map.values()) {
    agg.options.sort((a, b) => a.groupSize - b.groupSize);
  }

  return Array.from(map.values()).sort((a, b) => a.lowestPrice - b.lowestPrice);
}
