import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PropertyType, ListingType } from "@/data/properties";

export interface Filters {
  query: string;
  types: PropertyType[];
  listingType: "all" | ListingType;
  priceMin: number;
  priceMax: number;
  beds: number; // minimum beds, 0 = any
  baths: number;
  yearMin: number;
  amenities: string[];
}

export const DEFAULT_FILTERS: Filters = {
  query: "",
  types: [],
  listingType: "all",
  priceMin: 0,
  priceMax: 100_000_000,
  beds: 0,
  baths: 0,
  yearMin: 0,
  amenities: [],
};

interface FiltersState {
  filters: Filters;
  setFilter: <K extends keyof Filters>(k: K, v: Filters[K]) => void;
  setFilters: (f: Partial<Filters>) => void;
  reset: () => void;
  activeCount: () => number;
}

export const useFilters = create<FiltersState>((set, get) => ({
  filters: DEFAULT_FILTERS,
  setFilter: (k, v) => set((s) => ({ filters: { ...s.filters, [k]: v } })),
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  reset: () => set({ filters: DEFAULT_FILTERS }),
  activeCount: () => {
    const f = get().filters;
    let n = 0;
    if (f.query) n++;
    if (f.types.length) n++;
    if (f.listingType !== "all") n++;
    if (f.priceMin > 0) n++;
    if (f.priceMax < 100_000_000) n++;
    if (f.beds > 0) n++;
    if (f.baths > 0) n++;
    if (f.yearMin > 0) n++;
    if (f.amenities.length) n++;
    return n;
  },
}));

interface FavoritesState {
  ids: string[];
  toggle: (id: string) => void;
  isFav: (id: string) => boolean;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
        })),
      isFav: (id) => get().ids.includes(id),
    }),
    { name: "luxestate-favorites", storage: createJSONStorage(() => localStorage) },
  ),
);

interface UIState {
  mobileMenu: boolean;
  setMobileMenu: (v: boolean) => void;
  mapSidebarOpen: boolean;
  setMapSidebarOpen: (v: boolean) => void;
}

export const useUI = create<UIState>((set) => ({
  mobileMenu: false,
  setMobileMenu: (v) => set({ mobileMenu: v }),
  mapSidebarOpen: true,
  setMapSidebarOpen: (v) => set({ mapSidebarOpen: v }),
}));
