import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useFilters } from "@/store/useStore";
import { filteredProperties } from "@/lib/filter";
import { FiltersPanel } from "@/components/FiltersPanel";
import { PropertyCard } from "@/components/PropertyCard";
import { ClientOnly } from "@/components/ClientOnly";
import { GoogleLiveMap } from "@/components/GoogleLiveMap";
import {
  LayoutGrid,
  MapIcon,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Map Search — SHAMS EL MEDINA" },
      { name: "description", content: "Search for luxury properties on a live interactive world map with custom icons, 3D view, and advanced filters." },
      { property: "og:title", content: "Map Search — SHAMS EL MEDINA" },
      { property: "og:description", content: "Browse the world's most exceptional residences on an interactive map experience." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const filters = useFilters((s) => s.filters);
  const activeFilterCount = useFilters((s) => s.activeCount)();
  const results = useMemo(() => filteredProperties(filters), [filters]);
  const [view, setView] = useState<"map" | "grid">("map");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-charcoal pt-20">
      <div className="relative flex h-[calc(100vh-5rem)]">
        {/* Sidebar (filter panel) */}
        <aside
          className={`relative h-full shrink-0 border-r border-border bg-white transition-[width,opacity] duration-500 ${
            sidebarOpen ? "w-[380px] opacity-100" : "w-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="h-full overflow-y-auto">
            <FiltersPanel embedded onClose={() => setSidebarOpen(false)} />
          </div>
        </aside>

        {/* Search / Close toggle */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label={sidebarOpen ? "Close search" : "Open search"}
          className={`absolute top-4 z-30 inline-flex items-center gap-2 rounded-r-full border border-l-0 border-border bg-white/95 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-cream backdrop-blur-xl transition-all hover:border-gold hover:text-gold ${
            sidebarOpen ? "left-[380px]" : "left-0"
          }`}
        >
          {sidebarOpen ? (
            <X className="h-4 w-4 text-gold" />
          ) : (
            <Search className="h-4 w-4 text-gold" />
          )}
          <span className="hidden md:inline">{sidebarOpen ? "Close" : "Search"}</span>
          {!sidebarOpen && activeFilterCount > 0 && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Main */}
        <div className="relative flex-1 overflow-hidden">
          {/* View toggle */}
          <div className="absolute right-4 top-4 z-30 inline-flex rounded-full border border-border bg-white/95 p-1 backdrop-blur-xl shadow-luxe">
            <ToggleBtn active={view === "map"} onClick={() => setView("map")} icon={<MapIcon className="h-3.5 w-3.5" />} label="Map" />
            <ToggleBtn active={view === "grid"} onClick={() => setView("grid")} icon={<LayoutGrid className="h-3.5 w-3.5" />} label="Grid" />
          </div>

          {view === "map" ? (
            <ClientOnly fallback={
              <div className="flex h-full items-center justify-center bg-charcoal/50">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
                  <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Loading map…</p>
                </div>
              </div>
            }>
              <GoogleLiveMap properties={results} />
            </ClientOnly>
          ) : (
            <div className="h-full overflow-y-auto p-6">
              {results.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <SlidersHorizontal className="h-12 w-12 text-muted-foreground/30" />
                  <p className="text-muted-foreground">No residences match your filters.</p>
                  <button
                    onClick={() => useFilters.getState().reset()}
                    className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-wider text-cream/70 hover:border-gold hover:text-gold"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {results.map((p, i) => (
                    <PropertyCard key={p.id} property={p} index={i} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all ${
        active ? "bg-gradient-gold text-white" : "text-cream/60 hover:text-cream"
      }`}
    >
      {icon}{label}
    </button>
  );
}
