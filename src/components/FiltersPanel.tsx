import { Range, getTrackBackground } from "react-range";
import { useFilters } from "@/store/useStore";
import type { PropertyType } from "@/data/properties";
import { X, RotateCcw } from "lucide-react";

const TYPES: PropertyType[] = ["house", "villa", "land", "commercial"];
const AMENITIES = ["Pool", "Garage", "Garden", "Gym", "Wine Cellar", "Home Theater", "Smart Home", "Ocean View", "Mountain View", "Concierge", "Spa", "Tennis Court", "Fireplace", "Chef's Kitchen", "Elevator"];
const PRICE_MAX = 100_000_000;
const PRICE_STEP = 250_000;

interface Props {
  onClose?: () => void;
  embedded?: boolean;
}

export function FiltersPanel({ onClose, embedded = false }: Props) {
  const filters = useFilters((s) => s.filters);
  const setFilter = useFilters((s) => s.setFilter);
  const reset = useFilters((s) => s.reset);

  return (
    <div className={`flex h-full flex-col ${embedded ? "" : ""}`}>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-charcoal/95 px-6 py-5 backdrop-blur-xl">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">Refine</p>
          <h3 className="font-display text-2xl text-cream">Filters</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] uppercase tracking-wider text-cream/70 hover:border-gold hover:text-gold">
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
          {onClose && (
            <button onClick={onClose} className="rounded-full border border-border p-2 text-cream/70 hover:border-gold hover:text-gold">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-8 px-6 py-6">
        {/* Listing type */}
        <Section label="Listing">
          <div className="flex gap-2">
            {(["all", "sale", "rent"] as const).map((lt) => (
              <button
                key={lt}
                onClick={() => setFilter("listingType", lt)}
                className={`flex-1 rounded-full border px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${filters.listingType === lt ? "border-gold bg-gold text-charcoal" : "border-border bg-card/30 text-cream hover:border-gold/60"}`}
              >
                {lt === "all" ? "Any" : `For ${lt}`}
              </button>
            ))}
          </div>
        </Section>

        {/* Property types */}
        <Section label="Property type">
          <div className="grid grid-cols-2 gap-2">
            {TYPES.map((t) => {
              const active = filters.types.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => setFilter("types", active ? filters.types.filter((x) => x !== t) : [...filters.types, t])}
                  className={`rounded-lg border px-3 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${active ? "border-gold bg-gold/10 text-gold" : "border-border bg-card/30 text-cream hover:border-gold/60"}`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Price range */}
        <Section label="Price range">
          <PriceRange
            min={filters.priceMin}
            max={filters.priceMax}
            onChange={(min, max) => { setFilter("priceMin", min); setFilter("priceMax", max); }}
          />
        </Section>

        {/* Beds */}
        <Section label="Bedrooms">
          <Steppers value={filters.beds} onChange={(v) => setFilter("beds", v)} />
        </Section>

        {/* Baths */}
        <Section label="Bathrooms">
          <Steppers value={filters.baths} onChange={(v) => setFilter("baths", v)} />
        </Section>

        {/* Year */}
        <Section label="Built after">
          <input
            type="number"
            value={filters.yearMin || ""}
            min={1800}
            max={2025}
            onChange={(e) => setFilter("yearMin", Number(e.target.value) || 0)}
            placeholder="Any year"
            className="w-full rounded-lg border border-border bg-card/30 px-4 py-3 text-sm text-cream placeholder:text-muted-foreground focus:border-gold focus:outline-none"
          />
        </Section>

        {/* Amenities */}
        <Section label="Amenities">
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((a) => {
              const active = filters.amenities.includes(a);
              return (
                <button
                  key={a}
                  onClick={() => setFilter("amenities", active ? filters.amenities.filter((x) => x !== a) : [...filters.amenities, a])}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-colors ${active ? "border-gold bg-gold/10 text-gold" : "border-border bg-card/30 text-cream/80 hover:border-gold/60"}`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </Section>
      </div>

      {onClose && (
        <div className="sticky bottom-0 border-t border-border bg-charcoal/95 px-6 py-4 backdrop-blur-xl">
          <button onClick={onClose} className="btn-shimmer relative w-full rounded-full bg-gradient-gold py-3 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal">
            <span className="relative z-10">Show results</span>
          </button>
        </div>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function Steppers({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-colors ${value === n ? "border-gold bg-gold text-charcoal" : "border-border bg-card/30 text-cream hover:border-gold/60"}`}
        >
          {n === 0 ? "Any" : `${n}+`}
        </button>
      ))}
    </div>
  );
}

function PriceRange({ min, max, onChange }: { min: number; max: number; onChange: (min: number, max: number) => void }) {
  const values = [Math.max(0, min), Math.min(PRICE_MAX, max)];
  return (
    <div className="px-1.5 pt-2">
      <Range
        step={PRICE_STEP}
        min={0}
        max={PRICE_MAX}
        values={values}
        onChange={(v) => onChange(v[0], v[1])}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: 4,
              borderRadius: 999,
              background: getTrackBackground({
                values,
                colors: ["rgba(255,255,255,0.08)", "var(--gold)", "rgba(255,255,255,0.08)"],
                min: 0,
                max: PRICE_MAX,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { key, ...rest } = props as typeof props & { key?: string };
          return (
            <div
              {...rest}
              key={undefined}
              className="h-5 w-5 rounded-full bg-gold shadow-gold ring-4 ring-gold/20 focus:outline-none"
            />
          );
        }}
      />
      <div className="mt-4 flex items-center justify-between text-xs text-cream">
        <span>${(values[0] / 1_000_000).toFixed(1)}M</span>
        <span className="text-muted-foreground">to</span>
        <span>{values[1] >= PRICE_MAX ? "Any" : `$${(values[1] / 1_000_000).toFixed(1)}M`}</span>
      </div>
    </div>
  );
}
