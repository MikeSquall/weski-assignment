import { create } from 'zustand';
import { Hotel } from '../types/hotel';

interface SearchStore {
  skiSite: number | null;
  groupSize: number;
  fromDate: string;
  toDate: string;
  hotels: Hotel[];
  isLoading: boolean;
  isSearched: boolean;

  setSkiSite: (id: number) => void;
  setGroupSize: (size: number) => void;
  setFromDate: (date: string) => void;
  setToDate: (date: string) => void;
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
  hotels: [],
  isLoading: false,
  isSearched: false,

  setSkiSite: (id) => set({ skiSite: id }),
  setGroupSize: (size) => set({ groupSize: size }),
  setFromDate: (date) => set({ fromDate: date }),
  setToDate: (date) => set({ toDate: date }),
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
