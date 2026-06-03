import { Hotel, SKI_RESORTS } from '../types/hotel';
import { useSearchStore } from '../store/searchStore';

interface Props {
  hotel: Hotel;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mt-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`text-base leading-none ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function HotelCard({ hotel }: Props) {
  const skiSite = useSearchStore((s) => s.skiSite);
  const resort = SKI_RESORTS.find((r) => r.id === skiSite);

  const fallbackImage =
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80';

  return (
    <div className="bg-white rounded-lg overflow-hidden flex border border-gray-200 hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-72 h-52 flex-shrink-0">
        <img
          src={hotel.mainImage || fallbackImage}
          alt={hotel.hotelName}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
      </div>

      {/* Details */}
      <div className="flex-1 p-5 flex justify-between min-w-0">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-gray-900 leading-tight">
            {hotel.hotelName}
          </h3>
          <StarRating rating={hotel.rating} />

          {resort && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />
              <span className="text-sm text-gray-600">{resort.name}</span>
            </div>
          )}

          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {hotel.skiLiftDistance} to ski lift
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {hotel.cityCenterDistance} to center
            </span>
          </div>

          <div className="mt-2 text-xs text-gray-400">
            {hotel.beds} beds · room for {hotel.groupSize}
          </div>
        </div>

        {/* Price */}
        <div className="text-right flex flex-col justify-end shrink-0 ml-6">
          <p className="text-xl font-bold text-gray-900">
            £{hotel.priceAfterTax.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-gray-500">per person</p>
        </div>
      </div>
    </div>
  );
}
