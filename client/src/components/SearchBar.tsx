import type { FormEvent } from 'react';
import { useSearchStore } from '../store/searchStore';
import { useHotelSearch } from '../hooks/useHotelSearch';
import { SKI_RESORTS } from '../types/hotel';

export function SearchBar() {
  const skiSite = useSearchStore((s) => s.skiSite);
  const groupSize = useSearchStore((s) => s.groupSize);
  const fromDate = useSearchStore((s) => s.fromDate);
  const toDate = useSearchStore((s) => s.toDate);
  const isLoading = useSearchStore((s) => s.isLoading);
  const setSkiSite = useSearchStore((s) => s.setSkiSite);
  const setGroupSize = useSearchStore((s) => s.setGroupSize);
  const setFromDate = useSearchStore((s) => s.setFromDate);
  const setToDate = useSearchStore((s) => s.setToDate);
  const { search } = useHotelSearch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    search();
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-1.5 text-blue-700 font-black text-lg mr-2 shrink-0 select-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
          </svg>
          WeSki
        </div>

        <form onSubmit={handleSubmit} className="flex items-center flex-1">
          {/* Destination */}
          <div className="flex items-center gap-2 px-4 border-r border-gray-200">
            <svg
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <select
              value={skiSite ?? ''}
              onChange={(e) => setSkiSite(Number(e.target.value))}
              className="text-sm text-gray-700 bg-transparent border-none outline-none cursor-pointer min-w-[120px]"
              required
            >
              <option value="" disabled>
                Destination
              </option>
              {SKI_RESORTS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Group size */}
          <div className="flex items-center gap-2 px-4 border-r border-gray-200">
            <svg
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <select
              value={groupSize}
              onChange={(e) => setGroupSize(Number(e.target.value))}
              className="text-sm text-gray-700 bg-transparent border-none outline-none cursor-pointer"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'person' : 'people'}
                </option>
              ))}
            </select>
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2 px-4 border-r border-gray-200">
            <svg
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="text-sm text-gray-700 bg-transparent border-none outline-none cursor-pointer"
              required
            />
            <span className="text-gray-400 text-sm">–</span>
            <input
              type="date"
              value={toDate}
              min={fromDate}
              onChange={(e) => setToDate(e.target.value)}
              className="text-sm text-gray-700 bg-transparent border-none outline-none cursor-pointer"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="ml-4 px-5 py-2 bg-blue-700 text-white text-sm font-semibold rounded-md hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            {isLoading ? 'Searching…' : 'Search'}
          </button>
        </form>
      </div>
    </header>
  );
}
