import { useEffect, useRef } from "react";
import { hasMapboxToken, MAPBOX_TOKEN } from "@/lib/mapbox";

interface Props {
  lat: number;
  lng: number;
  zoom?: number;
  label?: string;
}

/** A reusable, dark-styled mini map with a glowing gold marker. */
export function OfficeMap({ lat, lng, zoom = 14, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !hasMapboxToken()) return;
    let cancelled = false;
    let mapInstance: import("mapbox-gl").Map | null = null;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled || !ref.current) return;
      mapboxgl.accessToken = MAPBOX_TOKEN!;
      mapInstance = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [lng, lat],
        zoom,
        attributionControl: true,
      });
      mapInstance.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

      const el = document.createElement("div");
      el.style.cssText = "width:24px;height:24px;border-radius:50%;background:#C9A84C;border:3px solid #0A0A0F;box-shadow:0 0 24px rgba(201,168,76,0.7);cursor:pointer;";
      const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(mapInstance);
      if (label) {
        marker.setPopup(new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(
          `<div style="font-family:DM Sans,sans-serif;background:rgba(10,10,15,0.92);color:#F5F0E8;padding:8px 12px;border-radius:8px;border:1px solid rgba(201,168,76,0.4);font-size:12px;">${label}</div>`,
        ));
      }
    })();

    return () => {
      cancelled = true;
      mapInstance?.remove();
    };
  }, [lat, lng, zoom, label]);

  if (!hasMapboxToken()) {
    return (
      <div className="flex h-full items-center justify-center bg-navy/30 text-center text-xs text-muted-foreground">
        Add VITE_MAPBOX_TOKEN to view the office map
      </div>
    );
  }
  return <div ref={ref} className="h-full w-full" />;
}
