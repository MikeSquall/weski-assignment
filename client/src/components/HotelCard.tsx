import { useState } from 'react';
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

function HotelImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const hasSrc = Boolean(src) && !errored;

  return (
    <div className="relative w-72 h-52 flex-shrink-0 bg-gray-100">
      {/* Skeleton shown while image is loading */}
      {hasSrc && !loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {hasSrc && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}

      {/* Shown when no src or image failed */}
      {!hasSrc && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <svg className="w-10 h-10 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5M4.5 6.75h15A2.25 2.25 0 0121.75 9v10.5A2.25 2.25 0 0119.5 21.75H4.5A2.25 2.25 0 012.25 19.5V9A2.25 2.25 0 014.5 6.75z" />
          </svg>
          <span className="text-xs">No image</span>
        </div>
      )}
    </div>
  );
}

export function HotelCard({ hotel }: Props) {
  const skiSite = useSearchStore((s) => s.skiSite);
  const resort = SKI_RESORTS.find((r) => r.id === skiSite);

  return (
    <div className="bg-white rounded-lg overflow-hidden flex border border-gray-200 hover:shadow-md transition-shadow">
      <HotelImage src={hotel.mainImage} alt={hotel.hotelName} />

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
