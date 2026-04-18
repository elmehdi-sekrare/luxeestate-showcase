import { PROPERTIES, type Property } from "@/data/properties";
import type { Filters } from "@/store/useStore";

export function applyFilters(items: Property[], f: Filters): Property[] {
  const q = f.query.trim().toLowerCase();
  return items.filter((p) => {
    if (q) {
      const hay = `${p.title} ${p.city} ${p.neighborhood} ${p.address}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.types.length && !f.types.includes(p.type)) return false;
    if (f.listingType !== "all" && p.listingType !== f.listingType) return false;
    if (p.price < f.priceMin) return false;
    if (p.price > f.priceMax) return false;
    if (f.beds > 0 && p.beds < f.beds) return false;
    if (f.baths > 0 && p.baths < f.baths) return false;
    if (f.yearMin > 0 && p.yearBuilt > 0 && p.yearBuilt < f.yearMin) return false;
    if (f.amenities.length && !f.amenities.every((a) => p.amenities.includes(a))) return false;
    return true;
  });
}

export function filteredProperties(f: Filters): Property[] {
  return applyFilters(PROPERTIES, f);
}
