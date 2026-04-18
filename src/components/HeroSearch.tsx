import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MapPin, Home, BedDouble, ChevronDown } from "lucide-react";
import { useFilters } from "@/store/useStore";
import type { PropertyType } from "@/data/properties";

const TYPES: { value: PropertyType | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
];

const PRICE_BUCKETS = [
  { min: 0, max: 100_000_000, label: "Any price" },
  { min: 0, max: 5_000_000, label: "Up to $5M" },
  { min: 5_000_000, max: 15_000_000, label: "$5M – $15M" },
  { min: 15_000_000, max: 30_000_000, label: "$15M – $30M" },
  { min: 30_000_000, max: 100_000_000, label: "$30M+" },
];

export function HeroSearch() {
  const navigate = useNavigate();
  const setFilter = useFilters((s) => s.setFilter);
  const setFilters = useFilters((s) => s.setFilters);
  const reset = useFilters((s) => s.reset);

  const [location, setLocation] = useState("");
  const [type, setType] = useState<PropertyType | "all">("all");
  const [bucket, setBucket] = useState(0);
  const [beds, setBeds] = useState(0);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    const b = PRICE_BUCKETS[bucket];
    setFilters({
      query: location,
      types: type === "all" ? [] : [type],
      priceMin: b.min,
      priceMax: b.max,
      beds,
    });
    void setFilter; // keep tree-shake-friendly reference
    navigate({ to: "/listings" });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={onSubmit}
      className="glass-strong relative w-full max-w-5xl rounded-2xl p-3 shadow-luxe"
    >
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.5fr,1fr,1fr,0.7fr,auto]">
        <Field icon={<MapPin className="h-4 w-4" />} label="Location">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, neighborhood…"
            className="w-full bg-transparent text-sm text-cream placeholder:text-muted-foreground focus:outline-none"
          />
        </Field>
        <Field icon={<Home className="h-4 w-4" />} label="Property type">
          <SelectShell>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PropertyType | "all")}
              className="w-full appearance-none bg-transparent text-sm text-cream focus:outline-none"
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-charcoal">{t.label}</option>
              ))}
            </select>
          </SelectShell>
        </Field>
        <Field label="Price range" icon={<span className="text-xs font-semibold">$</span>}>
          <SelectShell>
            <select
              value={bucket}
              onChange={(e) => setBucket(Number(e.target.value))}
              className="w-full appearance-none bg-transparent text-sm text-cream focus:outline-none"
            >
              {PRICE_BUCKETS.map((p, i) => (
                <option key={p.label} value={i} className="bg-charcoal">{p.label}</option>
              ))}
            </select>
          </SelectShell>
        </Field>
        <Field icon={<BedDouble className="h-4 w-4" />} label="Beds">
          <SelectShell>
            <select
              value={beds}
              onChange={(e) => setBeds(Number(e.target.value))}
              className="w-full appearance-none bg-transparent text-sm text-cream focus:outline-none"
            >
              {[0, 1, 2, 3, 4, 5, 6].map((b) => (
                <option key={b} value={b} className="bg-charcoal">{b === 0 ? "Any" : `${b}+`}</option>
              ))}
            </select>
          </SelectShell>
        </Field>
        <button
          type="submit"
          className="btn-shimmer relative inline-flex h-full items-center justify-center gap-2 rounded-xl bg-gradient-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-charcoal shadow-gold transition-transform hover:-translate-y-0.5"
        >
          <Search className="relative z-10 h-4 w-4" />
          <span className="relative z-10">Search</span>
        </button>
      </div>
    </motion.form>
  );
}

function Field({ icon, label, children }: { icon: ReactNodeWithText; label: string; children: ReactNodeWithText }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-border bg-card/30 px-4 py-3 transition-colors focus-within:border-gold/60">
      <span className="text-gold/70">{icon}</span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
        {children}
      </span>
    </label>
  );
}

function SelectShell({ children }: { children: ReactNodeWithText }) {
  return (
    <span className="relative flex items-center">
      {children}
      <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5 text-muted-foreground" />
    </span>
  );
}

type ReactNodeWithText = React.ReactNode;
