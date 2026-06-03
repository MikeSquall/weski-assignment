import { useMemo } from 'react';
import { useSearchStore } from '../store/searchStore';
import { SKI_RESORTS } from '../types/hotel';
import { aggregateHotels } from '../utils/aggregateHotels';
import { HotelCard } from './HotelCard';

function formatDate(iso: string): string {
  if (!iso) return '';
  // Append T00:00 to avoid timezone-shifting the date
  return new Date(`${iso}T00:00`).toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
  });
}

export function ResultsList() {
  const hotels = useSearchStore((s) => s.hotels);
  const isLoading = useSearchStore((s) => s.isLoading);
  const isSearched = useSearchStore((s) => s.isSearched);
  const lastSearch = useSearchStore((s) => s.lastSearch);
  const error = useSearchStore((s) => s.error);

  const aggregated = useMemo(() => aggregateHotels(hotels), [hotels]);

  if (!isSearched || !lastSearch) return null;

  const resort = SKI_RESORTS.find((r) => r.id === lastSearch.skiSite);
  const count = aggregated.length;

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Select your ski trip
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {count} ski trip{count !== 1 ? 's' : ''} options
        {resort && ` · ${resort.name}`}
        {` · ${formatDate(lastSearch.fromDate)} – ${formatDate(lastSearch.toDate)}`}
        {` · ${lastSearch.groupSize} ${lastSearch.groupSize === 1 ? 'person' : 'people'}`}
        {isLoading && ' · loading more…'}
      </p>

      <div className="flex flex-col gap-4">
        {aggregated.map((hotel) => (
          <HotelCard key={hotel.hotelCode} hotel={hotel} skiSite={lastSearch.skiSite} />
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {error}
        </div>
      )}

      {count === 0 && !isLoading && !error && (
        <p className="text-center text-gray-500 py-20">
          No hotels found for your search. Try adjusting the dates or destination.
        </p>
      )}

      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </main>
  );
}
