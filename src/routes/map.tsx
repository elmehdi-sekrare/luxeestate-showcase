import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ClientOnly } from "@/components/ClientOnly";
import { hasMapboxToken } from "@/lib/mapbox";
import { MapboxMissingNotice } from "@/components/MapboxMissingNotice";
import { useFilters } from "@/store/useStore";
import { filteredProperties } from "@/lib/filter";
import { FiltersPanel } from "@/components/FiltersPanel";
import { PropertyCard } from "@/components/PropertyCard";
import { LayoutGrid, MapIcon, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { LiveMap } from "@/components/LiveMap";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Map Search — LUXESTATE" },
      { name: "description", content: "Search for luxury properties on a live interactive world map with clustering, geocoding and instant filters." },
      { property: "og:title", content: "Map Search — LUXESTATE" },
      { property: "og:description", content: "Browse the world's most exceptional residences on an interactive map." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const filters = useFilters((s) => s.filters);
  const results = useMemo(() => filteredProperties(filters), [filters]);
  const [view, setView] = useState<"map" | "grid">("map");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tokenReady = hasMapboxToken();

  return (
    <div className="min-h-screen bg-charcoal pt-20">
      <div className="relative flex h-[calc(100vh-5rem)]">
        {/* Sidebar */}
        <aside
          className={`relative h-full shrink-0 border-r border-border bg-card/40 transition-[width,opacity] duration-500 ${
            sidebarOpen ? "w-[380px] opacity-100" : "w-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="h-full overflow-y-auto">
            <FiltersPanel embedded />
          </div>
        </aside>

        <button
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label={sidebarOpen ? "Hide filters" : "Show filters"}
          className={`absolute top-4 z-30 inline-flex items-center gap-2 rounded-r-full border border-l-0 border-border bg-card/80 px-3 py-2 text-xs font-medium uppercase tracking-wider text-cream backdrop-blur-xl transition-all hover:border-gold hover:text-gold ${sidebarOpen ? "left-[380px]" : "left-0"}`}
        >
          {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          <span className="hidden md:inline">{sidebarOpen ? "Hide" : "Filters"}</span>
        </button>

        {/* Main */}
        <div className="relative flex-1 overflow-hidden">
          {/* View toggle */}
          <div className="absolute right-4 top-4 z-30 inline-flex rounded-full border border-border bg-card/80 p-1 backdrop-blur-xl">
            <ToggleBtn active={view === "map"} onClick={() => setView("map")} icon={<MapIcon className="h-3.5 w-3.5" />} label="Map" />
            <ToggleBtn active={view === "grid"} onClick={() => setView("grid")} icon={<LayoutGrid className="h-3.5 w-3.5" />} label="Grid" />
          </div>

          {/* Result count */}
          <div className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full border border-border bg-card/80 px-5 py-2 text-xs uppercase tracking-wider text-cream backdrop-blur-xl">
            <span className="text-gold">{results.length}</span> {results.length === 1 ? "residence" : "residences"} found
          </div>

          {view === "map" ? (
            tokenReady ? (
              <ClientOnly fallback={<MapSkeleton />}>
                <LiveMap properties={results} />
              </ClientOnly>
            ) : (
              <div className="flex h-full items-center justify-center px-6">
                <div className="w-full max-w-2xl">
                  <MapboxMissingNotice />
                </div>
              </div>
            )
          ) : (
            <div className="h-full overflow-y-auto p-6">
              {results.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center text-muted-foreground">No residences match your filters.</div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {results.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
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
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all ${active ? "bg-gradient-gold text-charcoal" : "text-cream/70 hover:text-cream"}`}
    >
      {icon}{label}
    </button>
  );
}

function MapSkeleton() {
  return (
    <div className="flex h-full items-center justify-center bg-navy/30">
      <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Loading map…</div>
    </div>
  );
}
