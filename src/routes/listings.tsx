import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { SlidersHorizontal, X, ArrowDownUp, MapIcon, Search, LayoutGrid, LayoutList, Sparkles } from "lucide-react";
import { useFilters, DEFAULT_FILTERS } from "@/store/useStore";
import { filteredProperties } from "@/lib/filter";
import { PropertyCard } from "@/components/PropertyCard";
import type { PropertyType } from "@/data/properties";
import { FiltersPanel } from "@/components/FiltersPanel";

export const Route = createFileRoute("/listings")({
  head: () => ({
    meta: [
      { title: "Listings — SHAMS EL MEDINA" },
      { name: "description", content: "Browse the SHAMS EL MEDINA collection: villas, penthouses, estates and exceptional residences for sale and rent." },
      { property: "og:title", content: "Listings — SHAMS EL MEDINA" },
      { property: "og:description", content: "Browse the SHAMS EL MEDINA collection of exceptional residences." },
    ],
  }),
  component: ListingsPage,
});

type Sort = "newest" | "priceAsc" | "priceDesc" | "popular";

/* ── Animated counter ── */
function AnimCount({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(value);
  useEffect(() => {
    const from = prev.current;
    prev.current = value;
    const dur = 500;
    const start = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (value - from) * e));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <>{display}</>;
}

/* ── Stagger variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function ListingsPage() {
  const filters = useFilters((s) => s.filters);
  const setFilter = useFilters((s) => s.setFilter);
  const setFilters = useFilters((s) => s.setFilters);
  const reset = useFilters((s) => s.reset);
  const activeCount = useFilters((s) => s.activeCount());

  const [sort, setSort] = useState<Sort>("newest");
  const [drawer, setDrawer] = useState(false);
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const results = useMemo(() => {
    const items = filteredProperties(filters);
    const arr = [...items];
    if (sort === "priceAsc") arr.sort((a, b) => a.price - b.price);
    else if (sort === "priceDesc") arr.sort((a, b) => b.price - a.price);
    else if (sort === "popular") arr.sort((a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured));
    return arr;
  }, [filters, sort]);

  const chips = buildChips(filters);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <div className="bg-charcoal pt-28">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* ── Hero Header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex flex-col gap-3"
        >
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
            <span className="h-px w-8 bg-gold" />
            The Collection
          </p>
          <h1 className="font-display text-5xl leading-tight text-cream md:text-6xl">
            <span className="inline-block">
              <motion.span
                key={results.length}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block tabular-nums"
              >
                <AnimCount value={results.length} />
              </motion.span>
            </span>{" "}
            <em className="not-italic gold-text-gradient">
              {results.length === 1 ? "residence" : "residences"}
            </em>
          </h1>
          <p className="max-w-lg text-sm text-cream/50">
            Browse our curated selection of exceptional properties in Benslimane and beyond.
          </p>
        </motion.div>

        {/* ── Sticky filter bar ── */}
        <div className="sticky top-20 z-30 -mx-6 mb-8 border-y border-border px-6 py-4 backdrop-blur-xl lg:-mx-12 lg:px-12" style={{ background: "rgba(247,250,247,0.92)" }}>
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setDrawer(true)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-cream transition-colors hover:border-gold hover:text-gold"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {activeCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-charcoal"
                >
                  {activeCount}
                </motion.span>
              )}
            </motion.button>

            {/* Quick filters */}
            <div className="hidden flex-wrap gap-2 md:flex">
              {(["sale", "rent"] as const).map((lt) => {
                const active = filters.listingType === lt;
                return (
                  <motion.button
                    key={lt}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter("listingType", active ? "all" : lt)}
                    className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                      active
                        ? "border-gold bg-gold text-white shadow-gold"
                        : "border-border bg-white text-cream hover:border-gold/60 hover:bg-[#f0f5f1]"
                    }`}
                  >
                    For {lt}
                  </motion.button>
                );
              })}
              {(["house", "villa", "land", "commercial"] as PropertyType[]).map((t) => {
                const active = filters.types.includes(t);
                return (
                  <motion.button
                    key={t}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter("types", active ? filters.types.filter((x) => x !== t) : [...filters.types, t])}
                    className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                      active
                        ? "border-gold bg-gold/10 text-gold shadow-[0_0_16px_rgba(27,107,58,0.08)]"
                        : "border-border bg-white text-cream hover:border-gold/60 hover:bg-[#f0f5f1]"
                    }`}
                  >
                    {t}
                  </motion.button>
                );
              })}
            </div>

            <div className="ml-auto flex items-center gap-2">
              {/* Layout toggle */}
              <div className="hidden items-center rounded-full border border-border p-1 sm:inline-flex bg-white">
                <button
                  onClick={() => setLayout("grid")}
                  className={`rounded-full p-2 transition-all ${layout === "grid" ? "bg-gold/15 text-gold" : "text-cream/40 hover:text-cream"}`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setLayout("list")}
                  className={`rounded-full p-2 transition-all ${layout === "list" ? "bg-gold/15 text-gold" : "text-cream/40 hover:text-cream"}`}
                >
                  <LayoutList className="h-3.5 w-3.5" />
                </button>
              </div>

              <Link to="/map" className="hidden items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs font-medium uppercase tracking-wider text-cream transition-all hover:border-gold hover:text-gold sm:inline-flex">
                <MapIcon className="h-3.5 w-3.5" /> Map
              </Link>

              <div className="relative inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs text-cream">
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

          {/* Active filter chips */}
          <AnimatePresence>
            {chips.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {chips.map((c) => (
                    <motion.button
                      key={c.key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setFilters(c.clear)}
                      className="group inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-gold transition-all hover:bg-gold/20"
                    >
                      {c.label} <X className="h-3 w-3 transition-transform group-hover:rotate-90" />
                    </motion.button>
                  ))}
                  <button onClick={reset} className="text-[11px] uppercase tracking-wider text-muted-foreground underline-offset-4 hover:text-gold hover:underline">
                    Clear all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Results ── */}
        {results.length === 0 ? (
          <EmptyState onReset={reset} />
        ) : (
          <motion.div
            key={`${sort}-${activeCount}-${layout}`}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className={
              layout === "grid"
                ? "grid grid-cols-1 gap-6 pb-32 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid grid-cols-1 gap-4 pb-32 md:grid-cols-2"
            }
          >
            {results.map((p, i) => (
              <motion.div key={p.id} variants={itemVariants}>
                <PropertyCard property={p} index={i} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ── Filter drawer ── */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
              className="fixed inset-0 z-[70] bg-charcoal/70 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-32 text-center"
    >
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Search className="h-8 w-8 text-gold/50" />
        </motion.div>
      </div>
      <h3 className="font-display text-3xl text-cream">No residences match your search</h3>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">Try expanding the price range or removing a filter.</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="btn-shimmer relative mt-6 inline-flex items-center justify-center rounded-full bg-gradient-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal"
      >
        <span className="relative z-10">Reset filters</span>
      </motion.button>
    </motion.div>
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
