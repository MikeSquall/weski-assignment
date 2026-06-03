import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultsList } from '../components/ResultsList';
import { useSearchStore } from '../store/searchStore';
import { Hotel } from '../types/hotel';

function makeHotel(code: string, groupSize = 2): Hotel {
  return {
    hotelCode: code,
    hotelName: `Hotel ${code}`,
    mainImage: '',
    images: [],
    rating: 3,
    beds: 2,
    skiLiftDistance: '100m',
    cityCenterDistance: '200m',
    priceAfterTax: 200,
    priceBeforeTax: 180,
    groupSize,
  };
}

const base = {
  skiSite: 4 as number | null,
  groupSize: 2,
  fromDate: '2025-12-01',
  toDate: '2025-12-12',
  hotels: [] as Hotel[],
  isLoading: false,
  isSearched: false,
};

describe('ResultsList', () => {
  beforeEach(() => {
    useSearchStore.setState(base);
  });

  it('renders nothing before any search', () => {
    const { container } = render(<ResultsList />);
    expect(container.firstChild).toBeNull();
  });

  it('shows heading when isSearched is true', () => {
    useSearchStore.setState({ isSearched: true });
    render(<ResultsList />);
    expect(screen.getByText('Select your ski trip')).toBeInTheDocument();
  });

  it('shows spinner while loading', () => {
    useSearchStore.setState({ isSearched: true, isLoading: true });
    render(<ResultsList />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('hides spinner when done loading', () => {
    useSearchStore.setState({ isSearched: true, isLoading: false });
    render(<ResultsList />);
    expect(document.querySelector('.animate-spin')).toBeNull();
  });

  it('shows no-results message when search completes with empty list', () => {
    useSearchStore.setState({ isSearched: true, isLoading: false });
    render(<ResultsList />);
    expect(screen.getByText(/No hotels found/)).toBeInTheDocument();
  });

  it('shows singular trip count for one result', () => {
    useSearchStore.setState({ isSearched: true, hotels: [makeHotel('A')] });
    render(<ResultsList />);
    expect(screen.getByText(/1 ski trip option/)).toBeInTheDocument();
  });

  it('shows plural trip count for multiple results', () => {
    useSearchStore.setState({ isSearched: true, hotels: [makeHotel('A'), makeHotel('B')] });
    render(<ResultsList />);
    expect(screen.getByText(/2 ski trips options/)).toBeInTheDocument();
  });

  it('includes destination in subtitle', () => {
    useSearchStore.setState({ isSearched: true, skiSite: 4 });
    render(<ResultsList />);
    expect(screen.getByText(/La Plagne/)).toBeInTheDocument();
  });

  it('includes formatted dates in subtitle', () => {
    useSearchStore.setState({ isSearched: true });
    render(<ResultsList />);
    expect(screen.getByText(/1 Dec/)).toBeInTheDocument();
    expect(screen.getByText(/12 Dec/)).toBeInTheDocument();
  });

  it('shows "loading more…" in subtitle while loading', () => {
    useSearchStore.setState({ isSearched: true, isLoading: true });
    render(<ResultsList />);
    expect(screen.getByText(/loading more/)).toBeInTheDocument();
  });

  it('counts unique hotels not individual records when the same hotel appears for multiple group sizes', () => {
    useSearchStore.setState({
      isSearched: true,
      hotels: [makeHotel('A', 2), makeHotel('A', 3), makeHotel('B', 2)],
    });
    render(<ResultsList />);
    expect(screen.getByText(/2 ski trips options/)).toBeInTheDocument();
  });

  it('renders a HotelCard for each hotel', () => {
    useSearchStore.setState({
      isSearched: true,
      hotels: [makeHotel('A'), makeHotel('B'), makeHotel('C')],
    });
    render(<ResultsList />);
    expect(screen.getByText('Hotel A')).toBeInTheDocument();
    expect(screen.getByText('Hotel B')).toBeInTheDocument();
    expect(screen.getByText('Hotel C')).toBeInTheDocument();
  });
});
