import { Hotel, SearchParams } from '../../types';
import { IHotelProvider } from '../IHotelProvider';
import { apiResponseSchema } from './schemas';

const API_URL =
  'https://gya7b1xubh.execute-api.eu-west-2.amazonaws.com/default/HotelsSimulator';

export class PowderWhiteProvider implements IHotelProvider {
  async search(params: SearchParams): Promise<Hotel[]> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: {
          ski_site: params.skiSite,
          from_date: params.fromDate,
          to_date: params.toDate,
          group_size: params.groupSize,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Upstream API responded with status ${response.status}`);
    }

    const data = await response.json();
    const parsed = apiResponseSchema.parse(data);

    return parsed.body.accommodations.map((hotel) => {
      const mainImageObj = hotel.HotelDescriptiveContent.Images.find(
        (img) => img.MainImage === 'True'
      );
      const mainImage =
        mainImageObj?.URL ?? hotel.HotelDescriptiveContent.Images[0]?.URL ?? '';
      const images = hotel.HotelDescriptiveContent.Images.map((img) => img.URL);

      const skiLift = hotel.HotelInfo.Position.Distances.find(
        (d) => d.type === 'ski_lift'
      );
      const cityCenter = hotel.HotelInfo.Position.Distances.find(
        (d) => d.type === 'city_center'
      );

      return {
        hotelCode: hotel.HotelCode,
        hotelName: hotel.HotelName,
        mainImage,
        images,
        rating: parseInt(hotel.HotelInfo.Rating, 10),
        beds: parseInt(hotel.HotelInfo.Beds, 10),
        skiLiftDistance: skiLift?.distance ?? 'N/A',
        cityCenterDistance: cityCenter?.distance ?? 'N/A',
        priceAfterTax: parseFloat(hotel.PricesInfo.AmountAfterTax),
        priceBeforeTax: parseFloat(hotel.PricesInfo.AmountBeforeTax),
        groupSize: params.groupSize,
      };
    });
  }
}
