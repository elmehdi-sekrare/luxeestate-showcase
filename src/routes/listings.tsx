import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ArrowDownUp, MapIcon } from "lucide-react";
import { useFilters, DEFAULT_FILTERS } from "@/store/useStore";
import { filteredProperties } from "@/lib/filter";
import { PropertyCard } from "@/components/PropertyCard";
import type { PropertyType } from "@/data/properties";
import { FiltersPanel } from "@/components/FiltersPanel";

export const Route = createFileRoute("/listings")({
  head: () => ({
    meta: [
      { title: "Listings — LUXESTATE" },
      { name: "description", content: "Browse the LUXESTATE collection: villas, penthouses, estates and exceptional residences for sale and rent." },
      { property: "og:title", content: "Listings — LUXESTATE" },
      { property: "og:description", content: "Browse the LUXESTATE collection of exceptional residences." },
    ],
  }),
  component: ListingsPage,
});

type Sort = "newest" | "priceAsc" | "priceDesc" | "popular";

function ListingsPage() {
  const filters = useFilters((s) => s.filters);
  const setFilter = useFilters((s) => s.setFilter);
  const setFilters = useFilters((s) => s.setFilters);
  const reset = useFilters((s) => s.reset);
  const activeCount = useFilters((s) => s.activeCount());

  const [sort, setSort] = useState<Sort>("newest");
  const [drawer, setDrawer] = useState(false);

  const results = useMemo(() => {
    const items = filteredProperties(filters);
    const arr = [...items];
    if (sort === "priceAsc") arr.sort((a, b) => a.price - b.price);
    else if (sort === "priceDesc") arr.sort((a, b) => b.price - a.price);
    else if (sort === "popular") arr.sort((a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured));
    return arr;
  }, [filters, sort]);

  const chips = buildChips(filters);

  return (
    <div className="bg-charcoal pt-28">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">The Collection</p>
          <h1 className="font-display text-5xl leading-tight text-cream md:text-6xl">
            {results.length} <em className="not-italic gold-text-gradient">residences</em>
          </h1>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-20 z-30 -mx-6 mb-8 border-y border-border bg-charcoal/85 px-6 py-4 backdrop-blur-xl lg:-mx-12 lg:px-12">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setDrawer(true)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-xs font-medium uppercase tracking-wider text-cream transition-colors hover:border-gold hover:text-gold"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters {activeCount > 0 && <span className="rounded-full bg-gold px-1.5 py-0.5 text-[10px] text-charcoal">{activeCount}</span>}
            </button>

            <div className="hidden flex-wrap gap-2 md:flex">
              {(["sale", "rent"] as const).map((lt) => {
                const active = filters.listingType === lt;
                return (
                  <button
                    key={lt}
                    onClick={() => setFilter("listingType", active ? "all" : lt)}
                    className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${active ? "border-gold bg-gold text-charcoal" : "border-border bg-card/30 text-cream hover:border-gold/60"}`}
                  >
                    For {lt}
                  </button>
                );
              })}
              {(["house", "villa", "land", "commercial"] as PropertyType[]).map((t) => {
                const active = filters.types.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => setFilter("types", active ? filters.types.filter((x) => x !== t) : [...filters.types, t])}
                    className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${active ? "border-gold bg-gold text-charcoal" : "border-border bg-card/30 text-cream hover:border-gold/60"}`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Link to="/map" className="hidden items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wider text-cream transition-colors hover:border-gold hover:text-gold sm:inline-flex">
                <MapIcon className="h-3.5 w-3.5" /> Map view
              </Link>
              <div className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-xs text-cream">
                <ArrowDownUp className="h-3.5 w-3.5 text-gold" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="appearance-none bg-transparent pr-2 text-xs font-medium uppercase tracking-wider text-cream focus:outline-none"
                >
                  <option value="newest" className="bg-charcoal">Newest</option>
                  <option value="popular" className="bg-charcoal">Most popular</option>
                  <option value="priceDesc" className="bg-charcoal">Price · high to low</option>
                  <option value="priceAsc" className="bg-charcoal">Price · low to high</option>
                </select>
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <button key={c.key} onClick={() => setFilters(c.clear)} className="group inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-gold">
                  {c.label} <X className="h-3 w-3 transition-transform group-hover:rotate-90" />
                </button>
              ))}
              <button onClick={reset} className="text-[11px] uppercase tracking-wider text-muted-foreground underline-offset-4 hover:text-gold hover:underline">
                Clear all
              </button>
            </div>
          )}
        </div>

        {results.length === 0 ? (
          <EmptyState onReset={reset} />
        ) : (
          <div className="grid grid-cols-1 gap-6 pb-32 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Filter drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
              className="fixed inset-0 z-[70] bg-charcoal/70 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 32 }}
              className="fixed inset-y-0 left-0 z-[71] w-full max-w-md overflow-y-auto border-r border-border bg-charcoal grain"
            >
              <FiltersPanel onClose={() => setDrawer(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 text-gold">
        <SlidersHorizontal className="h-7 w-7" />
      </div>
      <h3 className="font-display text-3xl text-cream">No residences match your search</h3>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">Try expanding the price range or removing a filter.</p>
      <button onClick={onReset} className="btn-shimmer relative mt-6 inline-flex items-center justify-center rounded-full bg-gradient-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal">
        <span className="relative z-10">Reset filters</span>
      </button>
    </div>
  );
}

function buildChips(f: typeof DEFAULT_FILTERS) {
  const out: { key: string; label: string; clear: Partial<typeof DEFAULT_FILTERS> }[] = [];
  if (f.query) out.push({ key: "q", label: `"${f.query}"`, clear: { query: "" } });
  if (f.listingType !== "all") out.push({ key: "lt", label: `For ${f.listingType}`, clear: { listingType: "all" } });
  f.types.forEach((t) => out.push({ key: `t-${t}`, label: t, clear: { types: f.types.filter((x) => x !== t) } }));
  if (f.beds > 0) out.push({ key: "beds", label: `${f.beds}+ beds`, clear: { beds: 0 } });
  if (f.baths > 0) out.push({ key: "baths", label: `${f.baths}+ baths`, clear: { baths: 0 } });
  if (f.priceMin > 0) out.push({ key: "pmin", label: `Min $${(f.priceMin/1_000_000).toFixed(1)}M`, clear: { priceMin: 0 } });
  if (f.priceMax < 100_000_000) out.push({ key: "pmax", label: `Max $${(f.priceMax/1_000_000).toFixed(1)}M`, clear: { priceMax: 100_000_000 } });
  if (f.yearMin > 0) out.push({ key: "year", label: `Built after ${f.yearMin}`, clear: { yearMin: 0 } });
  f.amenities.forEach((a) => out.push({ key: `a-${a}`, label: a, clear: { amenities: f.amenities.filter((x) => x !== a) } }));
  return out;
}
