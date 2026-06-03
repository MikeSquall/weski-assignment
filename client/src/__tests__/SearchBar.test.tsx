import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../components/SearchBar';
import { useSearchStore } from '../store/searchStore';

vi.mock('../hooks/useHotelSearch', () => ({
  useHotelSearch: () => ({ search: vi.fn() }),
}));

const initial = {
  skiSite: null as number | null,
  groupSize: 2,
  fromDate: '',
  toDate: '',
  isLoading: false,
};

describe('SearchBar', () => {
  beforeEach(() => {
    useSearchStore.setState(initial);
  });

  it('renders the WeSki brand name', () => {
    render(<SearchBar />);
    expect(screen.getByText('WeSki')).toBeInTheDocument();
  });

  it('renders the Search button', () => {
    render(<SearchBar />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('lists all 5 ski resorts in the destination dropdown', () => {
    render(<SearchBar />);
    expect(screen.getByText('Val Thorens')).toBeInTheDocument();
    expect(screen.getByText('Courchevel')).toBeInTheDocument();
    expect(screen.getByText('Tignes')).toBeInTheDocument();
    expect(screen.getByText('La Plagne')).toBeInTheDocument();
    expect(screen.getByText('Chamonix')).toBeInTheDocument();
  });

  it('lists group sizes 1–10 in the people dropdown', () => {
    render(<SearchBar />);
    expect(screen.getByText('1 person')).toBeInTheDocument();
    expect(screen.getByText('10 people')).toBeInTheDocument();
  });

  it('updates skiSite in store when destination changes', () => {
    render(<SearchBar />);
    const [destinationSelect] = screen.getAllByRole('combobox');
    fireEvent.change(destinationSelect, { target: { value: '4' } });
    expect(useSearchStore.getState().skiSite).toBe(4);
  });

  it('updates groupSize in store when people count changes', () => {
    render(<SearchBar />);
    const [, groupSelect] = screen.getAllByRole('combobox');
    fireEvent.change(groupSelect, { target: { value: '5' } });
    expect(useSearchStore.getState().groupSize).toBe(5);
  });

  it('updates fromDate in store when start date changes', () => {
    render(<SearchBar />);
    const [fromInput] = screen.getAllByDisplayValue('');
    fireEvent.change(fromInput, { target: { value: '2025-12-01' } });
    expect(useSearchStore.getState().fromDate).toBe('2025-12-01');
  });

  it('shows Searching… label and disables button while loading', () => {
    useSearchStore.setState({ isLoading: true });
    render(<SearchBar />);
    const btn = screen.getByRole('button', { name: 'Searching…' });
    expect(btn).toBeDisabled();
  });
});
