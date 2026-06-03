import { create } from 'zustand';
import { Hotel } from '../types/hotel';

export interface SearchSnapshot {
  skiSite: number;
  groupSize: number;
  fromDate: string;
  toDate: string;
}

interface SearchStore {
  // Live form values — change as the user edits the form
  skiSite: number | null;
  groupSize: number;
  fromDate: string;
  toDate: string;

  // Frozen at the moment Search is clicked — drives the results display
  lastSearch: SearchSnapshot | null;

  hotels: Hotel[];
  isLoading: boolean;
  isSearched: boolean;

  setSkiSite: (id: number) => void;
  setGroupSize: (size: number) => void;
  setFromDate: (date: string) => void;
  setToDate: (date: string) => void;
  setLastSearch: (snapshot: SearchSnapshot) => void;
  addHotel: (hotel: Hotel) => void;
  setLoading: (loading: boolean) => void;
  setSearched: (searched: boolean) => void;
  clearResults: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  skiSite: null,
  groupSize: 2,
  fromDate: '',
  toDate: '',
  lastSearch: null,
  hotels: [],
  isLoading: false,
  isSearched: false,

  setSkiSite: (id) => set({ skiSite: id }),
  setGroupSize: (size) => set({ groupSize: size }),
  setFromDate: (date) => set({ fromDate: date }),
  setToDate: (date) => set({ toDate: date }),
  setLastSearch: (snapshot) => set({ lastSearch: snapshot }),
  addHotel: (hotel) =>
    set((state) => ({
      hotels: [...state.hotels, hotel].sort(
        (a, b) => a.priceAfterTax - b.priceAfterTax
      ),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setSearched: (searched) => set({ isSearched: searched }),
  clearResults: () => set({ hotels: [], isSearched: false }),
}));
