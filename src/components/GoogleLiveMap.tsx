import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  loadGoogleMaps,
  googleMapStyles,
  propertyMarkerIcon,
  userLocationIcon,
} from "@/lib/googleMaps";
import type { Property } from "@/data/properties";
import { formatPrice } from "@/data/properties";
import {
  Locate,
  Map as MapIcon,
  Globe2,
  X,
  Home,
  Building2,
  TreePine,
  Landmark,
  BedDouble,
  Bath,
  Ruler,
  ArrowRight,
} from "lucide-react";

interface Props {
  properties: Property[];
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  house: <Home className="h-4 w-4" />,
  villa: <Landmark className="h-4 w-4" />,
  land: <TreePine className="h-4 w-4" />,
  commercial: <Building2 className="h-4 w-4" />,
};

const TYPE_ICON_SM: Record<string, React.ReactNode> = {
  house: <Home className="h-3.5 w-3.5" />,
  villa: <Landmark className="h-3.5 w-3.5" />,
  land: <TreePine className="h-3.5 w-3.5" />,
  commercial: <Building2 className="h-3.5 w-3.5" />,
};

const TYPE_COLOR: Record<string, string> = {
  house: "#6DD3FF",
  villa: "#D8B85D",
  land: "#78D88B",
  commercial: "#F6A85D",
};

export function GoogleLiveMap({ properties }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const routeLinesRef = useRef<any[]>([]);
  const routeAnimRef = useRef<number | null>(null);
  const movingIconRef = useRef<any>(null);
  const activeRouteTargetRef = useRef<Property | null>(null);
  const onPropertyClickRef = useRef<(p: Property, marker?: any) => void>(() => {});

  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<Property | null>(null);
  const [is3D, setIs3D] = useState(false);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [legendExpanded, setLegendExpanded] = useState(true);

  /* ── init map ─────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then((g: any) => {
        if (cancelled || !mountRef.current) return;
        const map = new g.maps.Map(mountRef.current, {
          center: { lat: 33.6181, lng: -7.1200 },
          zoom: 14,
          minZoom: 2,
          styles: googleMapStyles,
          backgroundColor: "#0a0a0f",
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: { position: g.maps.ControlPosition.RIGHT_BOTTOM },
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: "greedy",
          mapTypeId: "roadmap",
        });
        mapRef.current = map;
        setReady(true);
      })
      .catch((err: Error) => setError(err.message));
    return () => { cancelled = true; };
  }, []);

  /* ── place markers ─── */
  useEffect(() => {
    if (!ready || !mapRef.current || !window.google) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();

    properties.forEach((p) => {
      const marker = new window.google.maps.Marker({
        position: { lat: p.lat, lng: p.lng },
        map: mapRef.current,
        icon: propertyMarkerIcon(p.type),
        title: p.title,
        animation: window.google.maps.Animation.DROP,
        optimized: false,
        zIndex: 10,
      });

      marker.addListener("click", () => {
        onPropertyClickRef.current(p, marker);
      });

      (marker as any).__luxeType = p.type;
      (marker as any).__luxeId = p.id;
      markersRef.current.push(marker);
      bounds.extend({ lat: p.lat, lng: p.lng });
    });

    if (properties.length > 1) {
      mapRef.current.fitBounds(bounds, { padding: 60 });
    } else if (properties.length === 1) {
      mapRef.current.panTo({ lat: properties[0].lat, lng: properties[0].lng });
      mapRef.current.setZoom(15);
    }

    const listener = window.google.maps.event.addListener(mapRef.current, "click", () => {
      // Only close popup, DON'T clear route
      setActive(null);
      markersRef.current.forEach((m) => {
        m.setIcon(propertyMarkerIcon(m.__luxeType, false));
        m.setZIndex(10);
      });
    });

    return () => {
      window.google?.maps.event.removeListener(listener);
    };
  }, [ready, properties]);

  /* ── handle property click ─── */
  const handlePropertyClick = useCallback((p: Property, marker?: any) => {
    setActive(p);
    mapRef.current?.panTo({ lat: p.lat, lng: p.lng });
    if (mapRef.current?.getZoom() < 14) {
      mapRef.current?.setZoom(14);
    }
    markersRef.current.forEach((m) => {
      const isThis = marker ? m === marker : m.__luxeId === p.id;
      m.setIcon(propertyMarkerIcon(m.__luxeType, isThis));
      m.setZIndex(isThis ? 100 : 10);
    });
    // Auto-draw route if user location is known
    if (userPos) {
      drawRoute(p);
    }
  }, [userPos]);

  // Keep ref in sync so marker listeners always call latest handler
  onPropertyClickRef.current = handlePropertyClick;

  /* ── 3D toggle ─── */
  const toggle3D = useCallback(() => {
    if (!mapRef.current || !window.google) return;
    const next = !is3D;
    setIs3D(next);
    if (next) {
      mapRef.current.setMapTypeId("hybrid");
      mapRef.current.setTilt(45);
      mapRef.current.setHeading(90);
      if (mapRef.current.getZoom() < 17) mapRef.current.setZoom(17);
    } else {
      mapRef.current.setMapTypeId("roadmap");
      mapRef.current.setOptions({ styles: googleMapStyles });
      mapRef.current.setTilt(0);
      mapRef.current.setHeading(0);
    }
  }, [is3D]);

  /* ── locate me (high accuracy + watchPosition for better results) ─── */
  const locateMe = useCallback(() => {
    if (!navigator.geolocation || !mapRef.current || !window.google) return;
    
    // Use watchPosition for better accuracy, then clear after getting a good fix
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        // Only accept high-accuracy results (< 100m)
        if (pos.coords.accuracy > 200) return;
        
        navigator.geolocation.clearWatch(watchId);
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(loc);

        if (userMarkerRef.current) userMarkerRef.current.setMap(null);

        const marker = new window.google.maps.Marker({
          position: loc,
          map: mapRef.current,
          icon: userLocationIcon(),
          title: "Your location",
          zIndex: 200,
          animation: window.google.maps.Animation.DROP,
        });
        userMarkerRef.current = marker;
        mapRef.current.panTo(loc);
        mapRef.current.setZoom(14);
      },
      () => alert("Could not get your location. Please allow location access."),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
    
    // Fallback: clear watch after 15s if no good fix
    setTimeout(() => navigator.geolocation.clearWatch(watchId), 15000);
  }, []);

  /* ── clear route ───── */
  const clearRoute = useCallback(() => {
    routeLinesRef.current.forEach((l) => l.setMap(null));
    if (movingIconRef.current) movingIconRef.current.setMap(null);
    if (routeAnimRef.current) cancelAnimationFrame(routeAnimRef.current);
    routeLinesRef.current = [];
    movingIconRef.current = null;
    routeAnimRef.current = null;
    activeRouteTargetRef.current = null;
  }, []);

  /* ── draw premium route ───── */
  const drawRoute = useCallback(
    (target: Property) => {
      if (!userPos || !mapRef.current || !window.google) return;
      clearRoute();
      activeRouteTargetRef.current = target;

      const from = userPos;
      const to = { lat: target.lat, lng: target.lng };
      const color = TYPE_COLOR[target.type] || "#D8B85D";

      // Outer glow line (wide, soft)
      const glowLine = new window.google.maps.Polyline({
        path: [from, to],
        map: mapRef.current,
        strokeColor: color,
        strokeOpacity: 0.15,
        strokeWeight: 28,
        zIndex: 1,
      });

      // Mid glow
      const midGlow = new window.google.maps.Polyline({
        path: [from, to],
        map: mapRef.current,
        strokeColor: color,
        strokeOpacity: 0.25,
        strokeWeight: 14,
        zIndex: 2,
      });

      // Main solid line
      const mainLine = new window.google.maps.Polyline({
        path: [from, to],
        map: mapRef.current,
        strokeColor: color,
        strokeOpacity: 0.9,
        strokeWeight: 4,
        zIndex: 3,
      });

      // Bright center line
      const centerLine = new window.google.maps.Polyline({
        path: [from, to],
        map: mapRef.current,
        strokeColor: "#0B3D21",
        strokeOpacity: 0.15,
        strokeWeight: 1.5,
        zIndex: 4,
      });

      routeLinesRef.current = [glowLine, midGlow, mainLine, centerLine];

      // Fit bounds
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(from);
      bounds.extend(to);
      mapRef.current.fitBounds(bounds, { padding: 100 });

      // Animated traveling icon — slow, smooth, infinite loop
      const iconSize = 36;
      const buildTravelerSvg = (progress: number) => {
        const pulse = Math.sin(progress * Math.PI * 2) * 0.15 + 1;
        const outerR = 14 * pulse;
        const outerOpacity = 0.12 + Math.sin(progress * Math.PI * 2) * 0.08;
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
          <circle cx="${iconSize/2}" cy="${iconSize/2}" r="${outerR}" fill="${color}" opacity="${outerOpacity}"/>
          <circle cx="${iconSize/2}" cy="${iconSize/2}" r="7" fill="${color}" opacity="0.9"/>
          <circle cx="${iconSize/2}" cy="${iconSize/2}" r="4" fill="#1A1F2E"/>
          <circle cx="${iconSize/2}" cy="${iconSize/2}" r="2" fill="${color}" opacity="0.6"/>
        </svg>`;
      };

      const movingMarker = new window.google.maps.Marker({
        position: from,
        map: mapRef.current,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(buildTravelerSvg(0))}`,
          scaledSize: new window.google.maps.Size(iconSize, iconSize),
          anchor: new window.google.maps.Point(iconSize/2, iconSize/2),
        },
        zIndex: 300,
      });
      movingIconRef.current = movingMarker;

      // Slow smooth animation — 6 second journey, infinite loop
      let startTime: number | null = null;
      const duration = 6000;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const rawProgress = (elapsed % (duration + 1500)) / duration; // +1500ms pause at destination
        const progress = Math.min(rawProgress, 1);
        const t = easeInOutQuart(progress);

        const lat = from.lat + (to.lat - from.lat) * t;
        const lng = from.lng + (to.lng - from.lng) * t;
        movingMarker.setPosition({ lat, lng });

        // Update icon with pulse
        movingMarker.setIcon({
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(buildTravelerSvg(progress))}`,
          scaledSize: new window.google.maps.Size(iconSize, iconSize),
          anchor: new window.google.maps.Point(iconSize/2, iconSize/2),
        });

        routeAnimRef.current = requestAnimationFrame(animate);
      };
      routeAnimRef.current = requestAnimationFrame(animate);
    },
    [userPos, clearRoute]
  );

  /* ── cleanup ──────── */
  useEffect(() => {
    return () => {
      if (routeAnimRef.current) cancelAnimationFrame(routeAnimRef.current);
    };
  }, []);

  /* ────────────────── render ────────────────── */
  if (error) {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <div className="rounded-2xl border border-border bg-charcoal p-8 text-center">
          <p className="font-display text-xl text-cream">Map Error</p>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mountRef} className="absolute inset-0" />

      {/* Loading */}
      {!ready && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-charcoal/80">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Loading map…</p>
          </div>
        </div>
      )}

      {/* 2D / 3D toggle */}
      <div className="absolute right-4 top-20 z-20 flex flex-col gap-2">
        <button
          onClick={toggle3D}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all backdrop-blur-xl ${
            is3D
              ? "border-gold bg-gold/20 text-gold shadow-[0_0_20px_rgba(27,107,58,0.3)]"
              : "border-border bg-charcoal/80 text-cream hover:border-gold hover:text-gold"
          }`}
        >
          {is3D ? <MapIcon className="h-4 w-4" /> : <Globe2 className="h-4 w-4" />}
          {is3D ? "2D" : "3D"}
        </button>
      </div>

      {/* Locate Me */}
      <div className="absolute bottom-32 right-4 z-20">
        <button
          onClick={locateMe}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all backdrop-blur-xl ${
            userPos
              ? "border-[#38BDF8] bg-[#38BDF8]/15 text-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              : "border-border bg-charcoal/80 text-cream hover:border-gold hover:text-gold"
          }`}
        >
          <Locate className="h-4 w-4" />
          {userPos ? "Located" : "Locate Me"}
        </button>
      </div>

      {/* ─── Premium Legend ─── */}
      <div 
        className="absolute bottom-6 left-4 z-20 overflow-hidden rounded-2xl border border-border/60 bg-charcoal/95 backdrop-blur-xl transition-all duration-500"
        style={{ 
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(245,240,232,0.05)",
        }}
      >
        <button
          onClick={() => setLegendExpanded((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3.5"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
            Property Types
          </p>
          <span className={`text-cream/50 transition-transform duration-300 ${legendExpanded ? "rotate-180" : ""}`}>
            ▾
          </span>
        </button>

        <div className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${legendExpanded ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
          <div className="border-t border-border/40 px-5 pb-4 pt-3">
            <div className="flex flex-col gap-3">
              {(["villa", "house", "land", "commercial"] as const).map((t, i) => (
                <div 
                  key={t} 
                  className="flex items-center gap-3 group"
                  style={{ 
                    animation: legendExpanded ? `fadeSlideIn 0.4s ease-out ${i * 0.08}s both` : "none"
                  }}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110"
                    style={{ 
                      color: TYPE_COLOR[t], 
                      borderColor: `${TYPE_COLOR[t]}40`,
                      background: `${TYPE_COLOR[t]}10`,
                      boxShadow: `0 0 12px ${TYPE_COLOR[t]}15`,
                    }}
                  >
                    {TYPE_ICON[t]}
                  </span>
                  <div>
                    <span className="text-sm font-medium capitalize text-cream">{t}</span>
                    <p className="text-[10px] text-muted-foreground">
                      {properties.filter(p => p.type === t).length} available
                    </p>
                  </div>
                </div>
              ))}

              {userPos && (
                <div className="flex items-center gap-3 border-t border-border/30 pt-3 mt-1">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#38BDF8]/40 bg-[#38BDF8]/10">
                    <Locate className="h-4 w-4 text-[#38BDF8]" />
                  </span>
                  <div>
                    <span className="text-sm font-medium text-cream">Your location</span>
                    <p className="text-[10px] text-muted-foreground">GPS active</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Property popup card */}
      {active && (
        <div className="absolute bottom-20 left-1/2 z-30 w-[min(380px,92vw)] -translate-x-1/2 animate-[fade-up_0.4s_ease-out_forwards]">
          <div 
            className="overflow-hidden rounded-2xl border border-border bg-charcoal"
            style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.3)" }}
          >
            <button
              onClick={() => {
                setActive(null);
                // DON'T clear route — route stays visible
                markersRef.current.forEach((m) => {
                  m.setIcon(propertyMarkerIcon(m.__luxeType, false));
                  m.setZIndex(10);
                });
              }}
              className="absolute right-3 top-3 z-40 rounded-full bg-charcoal/90 p-1.5 text-cream/70 hover:text-cream transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div
              className="absolute left-3 top-3 z-40 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest"
              style={{ background: TYPE_COLOR[active.type], color: "#1A1F2E" }}
            >
              {TYPE_ICON_SM[active.type]}
              {active.type}
            </div>

            <div className="relative aspect-[16/9] overflow-hidden">
              <img src={active.images[0]} alt={active.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071a07]/60 via-transparent to-transparent" />
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-xl text-cream">{formatPrice(active.price, active.listingType)}</p>
                  <p className="mt-0.5 text-sm font-medium text-cream/90">{active.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{active.neighborhood}, {active.city}</p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: active.listingType === "rent" ? "#6DD3FF" : "#78D88B",
                    color: "#1A1F2E",
                  }}
                >
                  For {active.listingType}
                </span>
              </div>

              {active.type !== "land" && (
                <div className="mt-3 flex items-center gap-4 text-xs text-cream/70">
                  <span className="inline-flex items-center gap-1"><BedDouble className="h-3.5 w-3.5 text-gold/70" /> {active.beds} beds</span>
                  <span className="inline-flex items-center gap-1"><Bath className="h-3.5 w-3.5 text-gold/70" /> {active.baths} baths</span>
                  <span className="inline-flex items-center gap-1"><Ruler className="h-3.5 w-3.5 text-gold/70" /> {active.sqft.toLocaleString()} sqft</span>
                </div>
              )}
              {active.type === "land" && (
                <div className="mt-3 text-xs text-cream/70">
                  <Ruler className="mr-1 inline h-3.5 w-3.5 text-gold/70" /> {active.lotSize} acres
                </div>
              )}

              <div className="mt-4">
                <Link
                  to="/property/$id"
                  params={{ id: active.id }}
                  className="btn-shimmer relative block w-full rounded-full bg-gradient-gold py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal"
                >
                  <span className="relative z-10 inline-flex items-center gap-1.5">View Details <ArrowRight className="h-3 w-3" /></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for legend animation */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}
