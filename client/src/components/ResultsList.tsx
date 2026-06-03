import { useSearchStore } from '../store/searchStore';
import { SKI_RESORTS } from '../types/hotel';
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
  const skiSite = useSearchStore((s) => s.skiSite);
  const groupSize = useSearchStore((s) => s.groupSize);
  const fromDate = useSearchStore((s) => s.fromDate);
  const toDate = useSearchStore((s) => s.toDate);

  if (!isSearched) return null;

  const resort = SKI_RESORTS.find((r) => r.id === skiSite);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Select your ski trip
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {hotels.length} ski trip{hotels.length !== 1 ? 's' : ''} options
        {resort && ` · ${resort.name}`}
        {fromDate && toDate && ` · ${formatDate(fromDate)} – ${formatDate(toDate)}`}
        {` · ${groupSize} ${groupSize === 1 ? 'person' : 'people'}`}
        {isLoading && ' · loading more…'}
      </p>

      <div className="flex flex-col gap-4">
        {hotels.map((hotel) => (
          <HotelCard
            key={`${hotel.hotelCode}-${hotel.groupSize}`}
            hotel={hotel}
          />
        ))}
      </div>

      {hotels.length === 0 && !isLoading && (
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
