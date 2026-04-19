import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { Locate } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { MAPBOX_TOKEN } from "@/lib/mapbox";
import type { Property } from "@/data/properties";
import { formatPrice } from "@/data/properties";

interface Props {
  properties: Property[];
}

export function LiveMap({ properties }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [active, setActive] = useState<Property | null>(null);

  // Stable feature collection
  const fc = useMemo<GeoJSON.FeatureCollection<GeoJSON.Point, { id: string }>>(() => ({
    type: "FeatureCollection",
    features: properties.map((p) => ({
      type: "Feature",
      properties: { id: p.id },
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
    })),
  }), [properties]);

  // Init map once
  useEffect(() => {
    if (!mountRef.current || mapRef.current || !MAPBOX_TOKEN) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mountRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-30, 35],
      zoom: 1.6,
      attributionControl: true,
      projection: "globe",
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "bottom-right");

    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mapboxgl: mapboxgl as any,
      marker: false,
      placeholder: "Search any address…",
      collapsed: false,
    });
    map.addControl(geocoder, "top-left");

    map.on("style.load", () => {
      map.setFog({
        color: "rgb(10, 10, 15)",
        "high-color": "rgb(13, 27, 42)",
        "horizon-blend": 0.05,
        "space-color": "rgb(5, 5, 10)",
        "star-intensity": 0.4,
      });

      map.addSource("props", {
        type: "geojson",
        data: fc,
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 50,
      });

      // Cluster bubbles
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "props",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step", ["get", "point_count"],
            "rgba(27,107,58,0.25)", 5,
            "rgba(27,107,58,0.4)", 15,
            "rgba(27,107,58,0.6)",
          ],
          "circle-stroke-color": "#1B6B3A",
          "circle-stroke-width": 2,
          "circle-radius": ["step", ["get", "point_count"], 22, 5, 28, 15, 36],
        },
      });
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "props",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
          "text-size": 13,
        },
        paint: { "text-color": "#FFFFFF" },
      });

      // Unclustered points
      map.addLayer({
        id: "point-glow",
        type: "circle",
        source: "props",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#1B6B3A",
          "circle-opacity": 0.15,
          "circle-radius": 18,
          "circle-blur": 0.6,
        },
      });
      map.addLayer({
        id: "point",
        type: "circle",
        source: "props",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#1B6B3A",
          "circle-radius": 8,
          "circle-stroke-color": "#FFFFFF",
          "circle-stroke-width": 2,
        },
      });

      // Cluster click → zoom in
      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
        const clusterId = features[0]?.properties?.cluster_id;
        const src = map.getSource("props") as mapboxgl.GeoJSONSource;
        if (clusterId == null) return;
        src.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom == null) return;
          const geom = features[0].geometry as GeoJSON.Point;
          map.easeTo({ center: geom.coordinates as [number, number], zoom });
        });
      });

      // Pin click
      map.on("click", "point", (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const id = f.properties?.id as string | undefined;
        if (!id) return;
        const found = properties.find((p) => p.id === id) || null;
        if (!found) return;
        setActive(found);
        const coords = (f.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
        map.easeTo({ center: coords, zoom: Math.max(map.getZoom(), 12), padding: { top: 80, bottom: 200, left: 0, right: 0 } });
      });

      const cursorOn = () => (map.getCanvas().style.cursor = "pointer");
      const cursorOff = () => (map.getCanvas().style.cursor = "");
      map.on("mouseenter", "clusters", cursorOn);
      map.on("mouseleave", "clusters", cursorOff);
      map.on("mouseenter", "point", cursorOn);
      map.on("mouseleave", "point", cursorOff);

      map.on("click", (e) => {
        const hit = map.queryRenderedFeatures(e.point, { layers: ["clusters", "point"] });
        if (hit.length === 0) setActive(null);
      });
    });

    return () => {
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update source data when properties change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const src = map.getSource("props") as mapboxgl.GeoJSONSource | undefined;
    if (src) src.setData(fc);
  }, [fc]);

  const locateMe = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      mapRef.current?.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 11, essential: true });
    });
  };

  return (
    <div className="relative h-full w-full">
      <div ref={mountRef} className="absolute inset-0" />
      <button
        onClick={locateMe}
        aria-label="Locate me"
        className="absolute bottom-24 right-4 z-20 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-xs font-medium uppercase tracking-wider text-cream backdrop-blur-xl hover:border-gold hover:text-gold"
      >
        <Locate className="h-4 w-4" /> Locate me
      </button>

      {active && (
        <div className="absolute bottom-20 left-1/2 z-20 w-[min(340px,90vw)] -translate-x-1/2 animate-[fade-up_0.4s_ease-out_forwards]">
          <Link
            to="/property/$id"
            params={{ id: active.id }}
            className="glass-strong group block overflow-hidden rounded-2xl shadow-luxe"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={active.images[0]} alt={active.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <button
                onClick={(e) => { e.preventDefault(); setActive(null); }}
                className="absolute right-3 top-3 rounded-full bg-charcoal/80 px-2 py-1 text-[10px] uppercase tracking-wider text-cream"
              >
                Close
              </button>
            </div>
            <div className="p-4">
              <p className="font-display text-xl text-cream">{formatPrice(active.price, active.listingType)}</p>
              <p className="mt-1 text-sm text-cream/80">{active.title}</p>
              <p className="text-xs text-muted-foreground">{active.neighborhood}, {active.city}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-cream/70">
                <span>{active.beds > 0 ? `${active.beds} bd · ${active.baths} ba` : `${active.lotSize} ac`}</span>
                <span className="text-gold">View details →</span>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
