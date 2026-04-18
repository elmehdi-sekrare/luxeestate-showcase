import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Share2, BedDouble, Bath, Maximize, Calendar, MapPin, Phone, Mail, MessageCircle, X, Check } from "lucide-react";
import { getProperty, similarProperties, formatPrice } from "@/data/properties";
import { useFavorites } from "@/store/useStore";
import { PropertyCard } from "@/components/PropertyCard";
import { ClientOnly } from "@/components/ClientOnly";
import { hasMapboxToken, MAPBOX_TOKEN } from "@/lib/mapbox";

export const Route = createFileRoute("/property/$id")({
  loader: ({ params }) => {
    const property = getProperty(params.id);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.property.title} — LUXESTATE` },
      { name: "description", content: loaderData.property.description },
      { property: "og:title", content: `${loaderData.property.title} — LUXESTATE` },
      { property: "og:description", content: loaderData.property.description },
      { property: "og:image", content: loaderData.property.images[0] },
      { name: "twitter:image", content: loaderData.property.images[0] },
    ] : [],
  }),
  component: PropertyDetailPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center pt-24">
      <div className="text-center">
        <h1 className="font-display text-5xl text-cream">Residence not found</h1>
        <Link to="/listings" className="mt-6 inline-block text-gold hover:underline">Back to listings</Link>
      </div>
    </div>
  ),
});

function PropertyDetailPage() {
  const data = Route.useLoaderData() as { property: import("@/data/properties").Property };
  const property = data.property;
  const fav = useFavorites((s) => s.ids.includes(property.id));
  const toggleFav = useFavorites((s) => s.toggle);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [shared, setShared] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const onScroll = () => setParallaxY(Math.min(window.scrollY * 0.3, 200));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onShare = async () => {
    const url = window.location.href;
    try { await navigator.clipboard.writeText(url); setShared(true); setTimeout(() => setShared(false), 2000); } catch { /* noop */ }
  };

  const similar = similarProperties(property, 6);

  return (
    <div className="bg-charcoal">
      {/* HERO */}
      <section ref={heroRef} className="relative h-[80vh] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          style={{ transform: `translateY(${parallaxY}px) scale(1.15)` }}
          className="absolute inset-0 h-full w-full object-cover transition-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/30" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-6 pb-16 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-charcoal/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream backdrop-blur">{property.type}</span>
              {property.listingType === "rent" && <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal">For Rent</span>}
            </div>
            <h1 className="font-display text-5xl leading-tight text-cream md:text-7xl">{property.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-cream/80"><MapPin className="h-4 w-4 text-gold" />{property.address}, {property.city}</p>
          </motion.div>
        </div>

        {/* Action buttons */}
        <div className="absolute right-6 top-28 z-20 flex flex-col gap-2 lg:right-12">
          <button onClick={() => toggleFav(property.id)} aria-label="Save" className={`rounded-full border border-border bg-charcoal/70 p-3 backdrop-blur hover:border-gold ${fav ? "text-gold" : "text-cream"}`}>
            <Heart className={`h-4 w-4 ${fav ? "fill-gold" : ""}`} />
          </button>
          <button onClick={onShare} aria-label="Share" className="rounded-full border border-border bg-charcoal/70 p-3 text-cream backdrop-blur hover:border-gold hover:text-gold">
            {shared ? <Check className="h-4 w-4 text-gold" /> : <Share2 className="h-4 w-4" />}
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Stats bar */}
        <div className="-mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-6">
          <Stat label="Price" value={formatPrice(property.price, property.listingType)} highlight />
          {property.beds > 0 && <Stat label="Bedrooms" value={String(property.beds)} icon={<BedDouble className="h-4 w-4" />} />}
          {property.baths > 0 && <Stat label="Bathrooms" value={String(property.baths)} icon={<Bath className="h-4 w-4" />} />}
          {property.sqft > 0 && <Stat label="Interior" value={`${property.sqft.toLocaleString()} sqft`} icon={<Maximize className="h-4 w-4" />} />}
          {property.lotSize > 0 && <Stat label="Lot" value={`${property.lotSize} ac`} />}
          {property.yearBuilt > 0 && <Stat label="Built" value={String(property.yearBuilt)} icon={<Calendar className="h-4 w-4" />} />}
        </div>

        <div className="grid gap-12 py-20 lg:grid-cols-[1.6fr,1fr]">
          {/* Main */}
          <div className="space-y-16">
            {/* Description */}
            <section>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">About this residence</p>
              <h2 className="font-display text-4xl text-cream">{property.description}</h2>
              <div className="gold-divider mt-8" />
            </section>

            {/* Gallery */}
            <section>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Gallery</p>
              <h2 className="mb-8 font-display text-4xl text-cream">A closer look</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {property.images.map((src, i) => (
                  <button key={i} onClick={() => setLightbox(i)} className={`group relative overflow-hidden rounded-xl ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}>
                    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-charcoal/0 transition-colors group-hover:bg-charcoal/30" />
                  </button>
                ))}
              </div>
            </section>

            {/* Floor plan (SVG) */}
            <FloorPlan />

            {/* Amenities */}
            <section>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Amenities</p>
              <h2 className="mb-8 font-display text-4xl text-cream">What's included</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {property.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-3 rounded-xl border border-border bg-card/30 px-4 py-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-gold"><Check className="h-4 w-4" /></span>
                    <span className="text-sm text-cream">{a}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Neighborhood */}
            <section>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">The neighborhood</p>
              <h2 className="mb-8 font-display text-4xl text-cream">{property.neighborhood}</h2>
              <div className="grid grid-cols-3 gap-3">
                <Score label="Walkability" value={property.walkability ?? 80} />
                <Score label="School rating" value={(property.schoolRating ?? 8) * 10} suffix={`${property.schoolRating}/10`} />
                <Score label="Safety" value={100 - (property.crimeScore ?? 2) * 15} />
              </div>
            </section>

            {/* Mini map */}
            <section>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Location</p>
              <h2 className="mb-8 font-display text-4xl text-cream">On the map</h2>
              <div className="overflow-hidden rounded-2xl border border-border" style={{ height: 380 }}>
                <ClientOnly fallback={<div className="flex h-full items-center justify-center bg-navy/30 text-xs uppercase tracking-[0.28em] text-muted-foreground">Loading…</div>}>
                  <MiniMap lat={property.lat} lng={property.lng} />
                </ClientOnly>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <AgentCard agent={property.agent} property={property.title} />
            <MortgageCalc price={property.price} />
          </aside>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <section className="border-t border-border py-20">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">You may also love</p>
            <h2 className="mb-10 font-display text-4xl text-cream md:text-5xl">Similar residences</h2>
            <div className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 lg:-mx-12 lg:px-12">
              {similar.map((p, i) => (
                <div key={p.id} className="w-[320px] shrink-0 snap-start md:w-[380px]">
                  <PropertyCard property={p} index={i} tilt={false} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 backdrop-blur-xl" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute right-6 top-6 rounded-full border border-border p-3 text-cream hover:border-gold hover:text-gold"><X className="h-5 w-5" /></button>
          <button onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! - 1 + property.images.length) % property.images.length); }} className="absolute left-6 rounded-full border border-border p-3 text-cream hover:border-gold hover:text-gold"><ChevronLeft className="h-5 w-5" /></button>
          <img src={property.images[lightbox]} alt="" className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! + 1) % property.images.length); }} className="absolute right-6 rounded-full border border-border p-3 text-cream hover:border-gold hover:text-gold"><ChevronRight className="h-5 w-5" /></button>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon, highlight }: { label: string; value: string; icon?: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`flex flex-col items-start gap-1 px-5 py-5 ${highlight ? "bg-gold/10" : "bg-card/60"}`}>
      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {icon && <span className="text-gold">{icon}</span>}{label}
      </span>
      <span className={`font-display ${highlight ? "text-2xl text-gold md:text-3xl" : "text-xl text-cream md:text-2xl"}`}>{value}</span>
    </div>
  );
}

function Score({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/30 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <div className="mt-4 flex items-end justify-between">
        <p className="font-display text-3xl text-cream">{suffix ?? `${Math.round(value)}`}</p>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-gradient-gold" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

function FloorPlan() {
  const [hover, setHover] = useState<string | null>(null);
  const rooms = [
    { id: "living", name: "Living Room", x: 20, y: 30, w: 180, h: 140 },
    { id: "kitchen", name: "Kitchen", x: 200, y: 30, w: 130, h: 140 },
    { id: "master", name: "Master Suite", x: 20, y: 170, w: 160, h: 130 },
    { id: "bed2", name: "Bedroom 2", x: 180, y: 170, w: 100, h: 130 },
    { id: "bath", name: "Bath", x: 280, y: 170, w: 50, h: 65 },
    { id: "study", name: "Study", x: 280, y: 235, w: 50, h: 65 },
  ];
  return (
    <section>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Floor plan</p>
      <h2 className="mb-8 font-display text-4xl text-cream">Interior layout</h2>
      <div className="overflow-hidden rounded-2xl border border-border bg-card/30 p-8">
        <svg viewBox="0 0 360 320" className="mx-auto h-auto w-full max-w-2xl">
          <rect x="10" y="20" width="340" height="290" fill="none" stroke="var(--gold)" strokeWidth="2" rx="6" />
          {rooms.map((r) => (
            <g key={r.id} onMouseEnter={() => setHover(r.id)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={hover === r.id ? "rgba(201,168,76,0.25)" : "rgba(245,240,232,0.04)"} stroke="rgba(245,240,232,0.3)" strokeWidth="1" />
              <text x={r.x + r.w / 2} y={r.y + r.h / 2} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontFamily="DM Sans" fill={hover === r.id ? "#C9A84C" : "#F5F0E8"} className="uppercase tracking-wider">
                {r.name}
              </text>
            </g>
          ))}
        </svg>
        <p className="mt-4 text-center text-xs text-muted-foreground">Hover rooms to highlight · Schematic representation</p>
      </div>
    </section>
  );
}

function AgentCard({ agent, property }: { agent: import("@/data/properties").Agent; property: string }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/40 grain">
      <div className="flex items-center gap-4 p-6">
        <img src={agent.photo} alt={agent.name} className="h-16 w-16 rounded-full object-cover ring-2 ring-gold/40" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{agent.title}</p>
          <p className="font-display text-2xl text-cream">{agent.name}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-px bg-border">
        <a href={`tel:${agent.phone}`} className="flex flex-col items-center gap-1 bg-card/60 py-4 text-cream hover:text-gold"><Phone className="h-4 w-4" /><span className="text-[10px] uppercase tracking-wider">Call</span></a>
        <a href={`https://wa.me/${agent.whatsapp}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 bg-card/60 py-4 text-cream hover:text-gold"><MessageCircle className="h-4 w-4" /><span className="text-[10px] uppercase tracking-wider">WhatsApp</span></a>
        <a href={`mailto:${agent.email}`} className="flex flex-col items-center gap-1 bg-card/60 py-4 text-cream hover:text-gold"><Mail className="h-4 w-4" /><span className="text-[10px] uppercase tracking-wider">Email</span></a>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-3 p-6">
        <input required placeholder="Your name" className="w-full rounded-lg border border-border bg-charcoal/40 px-4 py-2.5 text-sm text-cream placeholder:text-muted-foreground focus:border-gold focus:outline-none" />
        <input required type="email" placeholder="Email address" className="w-full rounded-lg border border-border bg-charcoal/40 px-4 py-2.5 text-sm text-cream placeholder:text-muted-foreground focus:border-gold focus:outline-none" />
        <textarea rows={3} defaultValue={`I'd like to know more about ${property}.`} className="w-full resize-none rounded-lg border border-border bg-charcoal/40 px-4 py-2.5 text-sm text-cream placeholder:text-muted-foreground focus:border-gold focus:outline-none" />
        <button type="submit" className="btn-shimmer relative w-full rounded-full bg-gradient-gold py-3 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal">
          <span className="relative z-10">{sent ? "Request sent ✓" : "Request a viewing"}</span>
        </button>
      </form>
    </div>
  );
}

function MortgageCalc({ price }: { price: number }) {
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const principal = price * (1 - downPct / 100);
  const r = rate / 100 / 12;
  const n = years * 12;
  const monthly = r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-6 grain">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">Mortgage calculator</p>
      <h3 className="mt-1 font-display text-2xl text-cream">Estimate monthly payment</h3>
      <div className="mt-6 space-y-4">
        <SliderInput label="Down payment" value={downPct} onChange={setDownPct} min={0} max={80} step={1} suffix="%" />
        <SliderInput label="Interest rate" value={rate} onChange={setRate} min={1} max={12} step={0.1} suffix="%" />
        <SliderInput label="Term" value={years} onChange={setYears} min={5} max={40} step={1} suffix=" yrs" />
      </div>
      <div className="mt-6 rounded-xl border border-gold/30 bg-gold/10 p-5 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">Estimated monthly</p>
        <p className="mt-1 font-display text-4xl text-cream">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(monthly || 0)}</p>
      </div>
    </div>
  );
}

function SliderInput({ label, value, onChange, min, max, step, suffix }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; suffix: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="text-cream">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[var(--gold)]" />
    </div>
  );
}

function MiniMap({ lat, lng }: { lat: number; lng: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || !hasMapboxToken()) return;
    let cancelled = false;
    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled || !ref.current) return;
      mapboxgl.accessToken = MAPBOX_TOKEN!;
      const map = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [lng, lat],
        zoom: 13,
      });
      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      const el = document.createElement("div");
      el.style.cssText = "width:24px;height:24px;border-radius:50%;background:#C9A84C;border:3px solid #0A0A0F;box-shadow:0 0 20px rgba(201,168,76,0.6);";
      new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
    })();
    return () => { cancelled = true; };
  }, [lat, lng]);
  if (!hasMapboxToken()) {
    return <div className="flex h-full items-center justify-center bg-navy/30 text-center text-xs text-muted-foreground">Add VITE_MAPBOX_TOKEN to view location map</div>;
  }
  return <div ref={ref} className="h-full w-full" />;
}
