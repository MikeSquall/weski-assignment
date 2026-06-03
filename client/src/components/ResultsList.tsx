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

  if (!isSearched || !lastSearch) return null;

  const resort = SKI_RESORTS.find((r) => r.id === lastSearch.skiSite);
  const aggregated = aggregateHotels(hotels);
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

      {count === 0 && !isLoading && (
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
