import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHotelSearch } from '../hooks/useHotelSearch';
import { useSearchStore } from '../store/searchStore';

class MockWebSocket {
  static instances: MockWebSocket[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((e: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: (() => void) | null = null;
  readyState = WebSocket.OPEN;
  sent: string[] = [];

  constructor(_url: string) {
    MockWebSocket.instances.push(this);
  }

  send(data: string) {
    this.sent.push(data);
  }

  close() {
    this.onclose?.();
  }

  emit(msg: unknown) {
    this.onmessage?.({ data: JSON.stringify(msg) });
  }
}

const storeBase = {
  skiSite: 4 as number | null,
  groupSize: 2,
  fromDate: '2025-12-01',
  toDate: '2025-12-12',
  lastSearch: null,
  hotels: [],
  isLoading: false,
  isSearched: false,
};

describe('useHotelSearch', () => {
  beforeEach(() => {
    MockWebSocket.instances = [];
    vi.stubGlobal('WebSocket', MockWebSocket);
    useSearchStore.setState(storeBase);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sets isLoading and isSearched when search is called', () => {
    const { result } = renderHook(() => useHotelSearch());
    act(() => result.current.search());
    expect(useSearchStore.getState().isLoading).toBe(true);
    expect(useSearchStore.getState().isSearched).toBe(true);
  });

  it('snapshots search params into lastSearch at submission time', () => {
    const { result } = renderHook(() => useHotelSearch());
    act(() => result.current.search());
    const { lastSearch } = useSearchStore.getState();
    expect(lastSearch).toEqual({
      skiSite: 4,
      groupSize: 2,
      fromDate: '2025-12-01',
      toDate: '2025-12-12',
    });
  });

  it('clears previous results before starting a new search', () => {
    useSearchStore.setState({ hotels: [{ hotelCode: 'OLD' } as never] });
    const { result } = renderHook(() => useHotelSearch());
    act(() => result.current.search());
    expect(useSearchStore.getState().hotels).toEqual([]);
  });

  it('sends correctly shaped message on WebSocket open', () => {
    const { result } = renderHook(() => useHotelSearch());
    act(() => result.current.search());
    const ws = MockWebSocket.instances[0];
    act(() => ws.onopen?.());

    expect(ws.sent).toHaveLength(1);
    const msg = JSON.parse(ws.sent[0]);
    expect(msg.type).toBe('search');
    expect(msg.payload.skiSite).toBe(4);
    expect(msg.payload.groupSize).toBe(2);
  });

  it('converts ISO dates to MM/DD/YYYY format for the API', () => {
    useSearchStore.setState({ fromDate: '2025-03-15', toDate: '2025-03-22' });
    const { result } = renderHook(() => useHotelSearch());
    act(() => result.current.search());
    const ws = MockWebSocket.instances[0];
    act(() => ws.onopen?.());

    const msg = JSON.parse(ws.sent[0]);
    expect(msg.payload.fromDate).toBe('03/15/2025');
    expect(msg.payload.toDate).toBe('03/22/2025');
  });

  it('adds each arriving hotel to the store', () => {
    const { result } = renderHook(() => useHotelSearch());
    act(() => result.current.search());
    const ws = MockWebSocket.instances[0];
    act(() => ws.onopen?.());

    const hotel = {
      hotelCode: 'H1', hotelName: 'Test', mainImage: '', images: [],
      rating: 3, beds: 2, skiLiftDistance: '100m', cityCenterDistance: '200m',
      priceAfterTax: 200, priceBeforeTax: 180, groupSize: 2,
    };
    act(() => ws.emit({ type: 'hotel', payload: hotel }));

    expect(useSearchStore.getState().hotels).toHaveLength(1);
    expect(useSearchStore.getState().hotels[0].hotelCode).toBe('H1');
  });

  it('sets isLoading to false on done message', () => {
    const { result } = renderHook(() => useHotelSearch());
    act(() => result.current.search());
    const ws = MockWebSocket.instances[0];
    act(() => ws.onopen?.());
    act(() => ws.emit({ type: 'done' }));

    expect(useSearchStore.getState().isLoading).toBe(false);
  });

  it('sets isLoading to false on error message', () => {
    const { result } = renderHook(() => useHotelSearch());
    act(() => result.current.search());
    const ws = MockWebSocket.instances[0];
    act(() => ws.onopen?.());
    act(() => ws.emit({ type: 'error', payload: 'Something went wrong' }));

    expect(useSearchStore.getState().isLoading).toBe(false);
  });

  it('stores the error message from the server in the store', () => {
    const { result } = renderHook(() => useHotelSearch());
    act(() => result.current.search());
    const ws = MockWebSocket.instances[0];
    act(() => ws.onopen?.());
    act(() => ws.emit({ type: 'error', payload: 'Search failed. Please try again.' }));

    expect(useSearchStore.getState().error).toBe('Search failed. Please try again.');
  });

  it('clears the previous error when a new search starts', () => {
    useSearchStore.setState({ error: 'Previous error' });
    const { result } = renderHook(() => useHotelSearch());
    act(() => result.current.search());

    expect(useSearchStore.getState().error).toBeNull();
  });

  it('closes the WebSocket when the component unmounts mid-search', () => {
    const { result, unmount } = renderHook(() => useHotelSearch());
    act(() => result.current.search());
    const ws = MockWebSocket.instances[0];
    const closeSpy = vi.spyOn(ws, 'close');

    unmount();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('does not search when required fields are missing', () => {
    useSearchStore.setState({ skiSite: null });
    const { result } = renderHook(() => useHotelSearch());
    act(() => result.current.search());

    expect(MockWebSocket.instances).toHaveLength(0);
    expect(useSearchStore.getState().isLoading).toBe(false);
  });
});
