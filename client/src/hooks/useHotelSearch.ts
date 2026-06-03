import { useCallback, useEffect, useRef } from 'react';
import { useSearchStore } from '../store/searchStore';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:3001';

function toApiDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${month}/${day}/${year}`;
}

export function useHotelSearch() {
  const wsRef = useRef<WebSocket | null>(null);

  const skiSite = useSearchStore((s) => s.skiSite);
  const groupSize = useSearchStore((s) => s.groupSize);
  const fromDate = useSearchStore((s) => s.fromDate);
  const toDate = useSearchStore((s) => s.toDate);
  const addHotel = useSearchStore((s) => s.addHotel);
  const setLoading = useSearchStore((s) => s.setLoading);
  const setSearched = useSearchStore((s) => s.setSearched);
  const setLastSearch = useSearchStore((s) => s.setLastSearch);
  const setError = useSearchStore((s) => s.setError);
  const clearResults = useSearchStore((s) => s.clearResults);

  const search = useCallback(() => {
    if (!skiSite || !fromDate || !toDate) return;

    wsRef.current?.close();
    clearResults();
    setLastSearch({ skiSite, groupSize, fromDate, toDate });
    setLoading(true);
    setSearched(true);

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'search',
          payload: {
            skiSite,
            groupSize,
            fromDate: toApiDate(fromDate),
            toDate: toApiDate(toDate),
          },
        })
      );
    };

    ws.onmessage = (event) => {
      if (wsRef.current !== ws) return;
      const msg = JSON.parse(event.data as string) as
        | { type: 'hotel'; payload: Parameters<typeof addHotel>[0] }
        | { type: 'done' }
        | { type: 'error'; payload: string };

      if (msg.type === 'hotel') {
        addHotel(msg.payload);
      } else if (msg.type === 'done') {
        setLoading(false);
        ws.close();
      } else if (msg.type === 'error') {
        setError(msg.payload);
        setLoading(false);
        ws.close();
      }
    };

    ws.onerror = () => {
      if (wsRef.current === ws) setLoading(false);
    };

    ws.onclose = () => {
      if (wsRef.current === ws) setLoading(false);
    };
  }, [skiSite, groupSize, fromDate, toDate, addHotel, setLoading, setSearched, setLastSearch, setError, clearResults]);

  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return { search };
}
