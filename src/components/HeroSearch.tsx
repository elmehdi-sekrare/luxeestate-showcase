import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MapPin, Home, BedDouble, ChevronDown, DollarSign } from "lucide-react";
import { useFilters } from "@/store/useStore";
import type { PropertyType } from "@/data/properties";
import { useLang, t } from "@/lib/i18n";

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
  const lang = useLang((s) => s.lang);

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
    void setFilter;
    navigate({ to: "/listings" });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={onSubmit}
      className="relative w-full max-w-4xl overflow-hidden rounded-full border border-[#1B6B3A]/20"
      style={{
        background: "linear-gradient(135deg, #e4ede5 0%, #edf3ee 50%, #e8f0e9 100%)",
        boxShadow: "0 8px 32px rgba(27,107,58,0.1), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)",
      }}
    >
      <div className="flex items-center gap-0">
        {/* Location */}
        <div className="flex flex-1 items-center gap-2.5 border-r border-[#1B6B3A]/10 px-5 py-4">
          <MapPin className="h-4 w-4 shrink-0 text-[#1B6B3A]" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t("search.placeholder", lang)}
            className="w-full bg-transparent text-sm text-[#1C2024] placeholder:text-[#6B7C72] focus:outline-none"
          />
        </div>

        {/* Type */}
        <div className="hidden items-center gap-2 border-r border-[#1B6B3A]/10 px-4 py-4 md:flex">
          <Home className="h-4 w-4 shrink-0 text-[#1B6B3A]" />
          <div className="relative">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PropertyType | "all")}
              className="appearance-none bg-transparent pr-5 text-sm text-[#1C2024] focus:outline-none"
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-[#edf3ee]">{t.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-[#6B7C72]" />
          </div>
        </div>

        {/* Price */}
        <div className="hidden items-center gap-2 border-r border-[#1B6B3A]/10 px-4 py-4 lg:flex">
          <DollarSign className="h-4 w-4 shrink-0 text-[#1B6B3A]" />
          <div className="relative">
            <select
              value={bucket}
              onChange={(e) => setBucket(Number(e.target.value))}
              className="appearance-none bg-transparent pr-5 text-sm text-[#1C2024] focus:outline-none"
            >
              {PRICE_BUCKETS.map((p, i) => (
                <option key={p.label} value={i} className="bg-[#edf3ee]">{p.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-[#6B7C72]" />
          </div>
        </div>

        {/* Beds */}
        <div className="hidden items-center gap-2 border-r border-[#1B6B3A]/10 px-4 py-4 lg:flex">
          <BedDouble className="h-4 w-4 shrink-0 text-[#1B6B3A]" />
          <div className="relative">
            <select
              value={beds}
              onChange={(e) => setBeds(Number(e.target.value))}
              className="appearance-none bg-transparent pr-5 text-sm text-[#1C2024] focus:outline-none"
            >
              {[0, 1, 2, 3, 4, 5, 6].map((b) => (
                <option key={b} value={b} className="bg-[#edf3ee]">{b === 0 ? "Any" : `${b}+`}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-[#6B7C72]" />
          </div>
        </div>

        {/* Search button */}
        <div className="p-1.5">
          <button
            type="submit"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1B6B3A] text-white shadow-[0_4px_16px_rgba(27,107,58,0.3)] transition-all duration-300 hover:bg-[#145A32] hover:shadow-[0_6px_24px_rgba(27,107,58,0.4)]"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.form>
  );
}
