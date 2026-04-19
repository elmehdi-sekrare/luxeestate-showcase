import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Share2, BedDouble, Bath, Maximize, Calendar, MapPin, Phone, Mail, MessageCircle, X, Check, ArrowLeft, Expand, Star } from "lucide-react";
import { getProperty, similarProperties, formatPrice } from "@/data/properties";
import { useFavorites } from "@/store/useStore";
import { PropertyCard } from "@/components/PropertyCard";
import { ClientOnly } from "@/components/ClientOnly";
import { loadGoogleMaps, googleMapStyles, propertyMarkerIcon } from "@/lib/googleMaps";
import { useLang, t } from "@/lib/i18n";

export const Route = createFileRoute("/property/$id")({
  loader: ({ params }) => {
    const property = getProperty(params.id);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.property.title} — SHAMS EL MEDINA` },
      { name: "description", content: loaderData.property.description },
      { property: "og:title", content: `${loaderData.property.title} — SHAMS EL MEDINA` },
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

/* ── Scroll animation wrapper ─── */
function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function PropertyDetailPage() {
  const data = Route.useLoaderData() as { property: import("@/data/properties").Property };
  const property = data.property;
  const fav = useFavorites((s) => s.ids.includes(property.id));
  const toggleFav = useFavorites((s) => s.toggle);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [shared, setShared] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [parallaxY, setParallaxY] = useState(0);
  const lang = useLang((s) => s.lang);

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
      <section ref={heroRef} className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <motion.img
          initial={{ scale: 1.2 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          src={property.images[0]}
          alt={property.title}
          style={{ transform: `translateY(${parallaxY}px)` }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071a07]/80 via-[#0d2b0d]/40 to-transparent" />

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute left-6 top-28 z-20 lg:left-12"
        >
          <Link to="/listings" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-charcoal/60 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-xl transition-all hover:border-gold hover:text-gold">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-6 pb-14 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-charcoal/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">{property.type}</span>
              {property.listingType === "rent" && <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal">For Rent</span>}
              {property.isFeatured && <span className="rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal">Featured</span>}
            </div>
            <h1 className="font-display text-4xl leading-tight text-white md:text-6xl" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.3)" }}>{property.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-white/90" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}><MapPin className="h-4 w-4 text-[#8BC34A]" />{property.address}, {property.city}</p>
          </motion.div>
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute right-6 top-28 z-20 flex flex-col gap-2 lg:right-12"
        >
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toggleFav(property.id)} aria-label="Save" className={`rounded-full border border-white/20 bg-charcoal/70 p-3 backdrop-blur-xl transition-all hover:border-gold hover:shadow-[0_0_20px_rgba(27,107,58,0.15)] ${fav ? "text-gold" : "text-white"}`}>
            <Heart className={`h-4 w-4 ${fav ? "fill-gold" : ""}`} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onShare} aria-label="Share" className="rounded-full border border-white/20 bg-charcoal/70 p-3 text-white backdrop-blur-xl transition-all hover:border-gold hover:text-gold hover:shadow-[0_0_20px_rgba(27,107,58,0.15)]">
            {shared ? <Check className="h-4 w-4 text-gold" /> : <Share2 className="h-4 w-4" />}
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setLightbox(0)} aria-label="Gallery" className="rounded-full border border-white/20 bg-charcoal/70 p-3 text-white backdrop-blur-xl transition-all hover:border-gold hover:text-gold hover:shadow-[0_0_20px_rgba(27,107,58,0.15)]">
            <Expand className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </section>

      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Stats bar */}
        <AnimatedSection>
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-6">
            <Stat label="Price" value={formatPrice(property.price, property.listingType)} highlight />
            {property.beds > 0 && <Stat label="Bedrooms" value={String(property.beds)} icon={<BedDouble className="h-4 w-4" />} />}
            {property.baths > 0 && <Stat label="Bathrooms" value={String(property.baths)} icon={<Bath className="h-4 w-4" />} />}
            {property.sqft > 0 && <Stat label="Interior" value={`${property.sqft.toLocaleString()} sqft`} icon={<Maximize className="h-4 w-4" />} />}
            {property.lotSize > 0 && <Stat label="Lot" value={`${property.lotSize} ac`} />}
            {property.yearBuilt > 0 && <Stat label="Built" value={String(property.yearBuilt)} icon={<Calendar className="h-4 w-4" />} />}
          </div>
        </AnimatedSection>

        <div className="grid gap-12 py-20 lg:grid-cols-[1.6fr,1fr]">
          {/* Main */}
          <div className="space-y-16">
            {/* Description */}
            <AnimatedSection>
              <section>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">{t("property.about", lang)}</p>
                <h2 className="font-display text-4xl text-[#1C2024]">{property.description}</h2>
                <div className="gold-divider mt-8" />
              </section>
            </AnimatedSection>

            {/* Gallery */}
            <AnimatedSection delay={0.1}>
              <section>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">{t("property.gallery", lang)}</p>
                <h2 className="mb-8 font-display text-4xl text-[#1C2024]">{t("property.closerLook", lang)}</h2>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {property.images.map((src, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setLightbox(i)}
                      className={`group relative overflow-hidden rounded-xl ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}
                    >
                      <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-charcoal/0 transition-all group-hover:bg-charcoal/30" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="rounded-full bg-charcoal/70 p-3 text-cream backdrop-blur-xl"><Expand className="h-5 w-5" /></span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </section>
            </AnimatedSection>

            {/* Floor plan */}
            <AnimatedSection delay={0.1}>
              <FloorPlan />
            </AnimatedSection>

            {/* Amenities */}
            <AnimatedSection delay={0.1}>
              <section>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">{t("property.amenities", lang)}</p>
                <h2 className="mb-8 font-display text-4xl text-[#1C2024]">{t("property.included", lang)}</h2>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
                  className="grid grid-cols-2 gap-3 md:grid-cols-3"
                >
                  {property.amenities.map((a) => (
                    <motion.div
                      key={a}
                      variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                      whileHover={{ scale: 1.02, borderColor: "rgba(27,107,58,0.4)" }}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card/30 px-4 py-3 transition-all duration-300 hover:bg-card/50 hover:shadow-[0_0_20px_rgba(27,107,58,0.06)]"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-gold"><Check className="h-4 w-4" /></span>
                      <span className="text-sm text-[#1C2024]">{a}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            </AnimatedSection>

            {/* Neighborhood */}
            <AnimatedSection delay={0.1}>
              <section>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">{t("property.neighborhood", lang)}</p>
                <h2 className="mb-8 font-display text-4xl text-[#1C2024]">{property.neighborhood}</h2>
                <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
                  {[
                    { icon: "🏫", label: "École", dist: "300m" },
                    { icon: "🕌", label: "Mosquée", dist: "150m" },
                    { icon: "🌳", label: "Parc & Jardin", dist: "200m" },
                    { icon: "💊", label: "Pharmacie", dist: "100m" },
                    { icon: "🛒", label: "Marché", dist: "400m" },
                    { icon: "🏥", label: "Hôpital", dist: "1.2km" },
                  ].map((item) => (
                    <motion.div
                      key={item.label}
                      whileHover={{ y: -4, borderColor: "rgba(27,107,58,0.3)" }}
                      className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card/30 px-3 py-5 text-center transition-all hover:bg-[#1B6B3A]/[0.03] hover:shadow-[0_4px_16px_rgba(27,107,58,0.06)]"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <p className="text-xs font-semibold text-[#1C2024]">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">{item.dist}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            </AnimatedSection>

            {/* Location Map — Google Maps 3D satellite view */}
            <AnimatedSection delay={0.1}>
              <section>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">{t("property.location", lang)}</p>
                <h2 className="mb-8 font-display text-4xl text-[#1C2024]">{t("property.onMap", lang)}</h2>
                <div className="overflow-hidden rounded-2xl border border-border" style={{ height: 420 }}>
                  <ClientOnly fallback={<div className="flex h-full items-center justify-center bg-navy/30 text-xs uppercase tracking-[0.28em] text-muted-foreground">Loading…</div>}>
                    <GoogleMiniMap lat={property.lat} lng={property.lng} type={property.type} title={property.title} />
                  </ClientOnly>
                </div>
              </section>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <AnimatedSection delay={0.2}>
              <AgentCard agent={property.agent} property={property.title} />
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <MortgageCalc price={property.price} />
            </AnimatedSection>
          </aside>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <AnimatedSection>
            <section className="border-t border-border py-20">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">{t("property.similar", lang)}</p>
              <h2 className="mb-10 font-display text-4xl text-[#1C2024] md:text-5xl">{t("property.similarTitle", lang)}</h2>
              <div className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 lg:-mx-12 lg:px-12">
                {similar.map((p, i) => (
                  <div key={p.id} className="w-[320px] shrink-0 snap-start md:w-[380px]">
                    <PropertyCard property={p} index={i} tilt={false} />
                  </div>
                ))}
              </div>
            </section>
          </AnimatedSection>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 backdrop-blur-xl"
            onClick={() => setLightbox(null)}
          >
            <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setLightbox(null)} className="absolute right-6 top-6 rounded-full border border-border bg-charcoal/50 p-3 text-cream backdrop-blur hover:border-gold hover:text-gold"><X className="h-5 w-5" /></motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! - 1 + property.images.length) % property.images.length); }} className="absolute left-6 rounded-full border border-border bg-charcoal/50 p-3 text-cream backdrop-blur hover:border-gold hover:text-gold"><ChevronLeft className="h-5 w-5" /></motion.button>
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={property.images[lightbox]}
              alt=""
              className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! + 1) % property.images.length); }} className="absolute right-6 rounded-full border border-border bg-charcoal/50 p-3 text-cream backdrop-blur hover:border-gold hover:text-gold"><ChevronRight className="h-5 w-5" /></motion.button>
            {/* Image counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-border/50 bg-charcoal/80 px-4 py-2 text-xs font-medium text-cream backdrop-blur">
              {lightbox + 1} / {property.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value, icon, highlight }: { label: string; value: string; icon?: React.ReactNode; highlight?: boolean }) {
  return (
    <motion.div
      whileHover={{ backgroundColor: highlight ? "rgba(27,107,58,0.15)" : "rgba(245,240,232,0.06)" }}
      className={`flex flex-col items-start gap-1 px-5 py-5 transition-all ${highlight ? "bg-gold/10" : "bg-card/60"}`}
    >
      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {icon && <span className="text-gold">{icon}</span>}{label}
      </span>
      <span className={`font-display ${highlight ? "text-2xl text-gold md:text-3xl" : "text-xl text-[#1C2024] md:text-2xl"}`}>{value}</span>
    </motion.div>
  );
}

function Score({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/30 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <div className="mt-4 flex items-end justify-between">
        <p className="font-display text-3xl text-[#1C2024]">{suffix ?? `${Math.round(value)}`}</p>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-gradient-gold" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

function FloorPlan() {
  const [hover, setHover] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const rooms = [
    { id: "living", name: "Living Room", x: 20, y: 30, w: 180, h: 140 },
    { id: "kitchen", name: "Kitchen", x: 200, y: 30, w: 130, h: 140 },
    { id: "master", name: "Master Suite", x: 20, y: 170, w: 160, h: 130 },
    { id: "bed2", name: "Bedroom 2", x: 180, y: 170, w: 100, h: 130 },
    { id: "bath", name: "Bath", x: 280, y: 170, w: 50, h: 65 },
    { id: "study", name: "Study", x: 280, y: 235, w: 50, h: 65 },
  ];

  const layoutImages = [
    new URL("../benslimane-01.jpg", import.meta.url).href,
    new URL("../benslimane-02.jpg", import.meta.url).href,
    new URL("../benslimane-04.jpg", import.meta.url).href,
    new URL("../benslimane-06.jpg", import.meta.url).href,
  ];

  return (
    <section>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Floor plan</p>
      <h2 className="mb-8 font-display text-4xl text-[#1C2024]">Interior layout</h2>

      {/* SVG Floor Plan */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card/30 p-8">
        <svg viewBox="0 0 360 320" className="mx-auto h-auto w-full max-w-2xl">
          <rect x="10" y="20" width="340" height="290" fill="none" stroke="var(--gold)" strokeWidth="2" rx="6" />
          {rooms.map((r) => (
            <g key={r.id} onMouseEnter={() => setHover(r.id)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={hover === r.id ? "rgba(27,107,58,0.2)" : "rgba(27,107,58,0.04)"} stroke="rgba(27,107,58,0.35)" strokeWidth="1" />
              <text x={r.x + r.w / 2} y={r.y + r.h / 2} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontFamily="DM Sans" fill={hover === r.id ? "#1B6B3A" : "#3a5a3a"} className="uppercase tracking-wider">
                {r.name}
              </text>
            </g>
          ))}
        </svg>
        <p className="mt-4 text-center text-xs text-muted-foreground">Hover rooms to highlight · Schematic representation</p>
      </div>

      {/* Real Layout Images Gallery */}
      <div className="mt-6">
        <div className="relative overflow-hidden rounded-2xl border border-border" style={{ height: 320 }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg}
              src={layoutImages[activeImg]}
              alt={`Shams El Medina - Vue ${activeImg + 1}`}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051205]/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8BC34A]">Projet Shams El Medina</p>
            <p className="mt-1 font-display text-xl text-white">Vue aérienne {activeImg + 1}/{layoutImages.length}</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {layoutImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                i === activeImg
                  ? "border-[#1B6B3A] shadow-[0_0_12px_rgba(27,107,58,0.2)]"
                  : "border-transparent opacity-60 hover:opacity-90"
              }`}
            >
              <img src={src} alt="" className="aspect-[16/10] w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentCard({ agent, property }: { agent: import("@/data/properties").Agent; property: string }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/40 transition-all duration-500 hover:border-gold/30 hover:shadow-[0_0_40px_rgba(27,107,58,0.06)] grain">
      <div className="flex items-center gap-4 p-6">
        <div className="relative">
          <img src={agent.photo} alt={agent.name} className="h-16 w-16 rounded-full object-cover ring-2 ring-gold/40" />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 ring-2 ring-charcoal">
            <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
          </span>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{agent.title}</p>
          <p className="font-display text-2xl text-[#1C2024]">{agent.name}</p>
          <div className="mt-1 flex gap-0.5">{[...Array(5)].map((_,i)=><Star key={i} className="h-3 w-3 fill-gold text-gold" />)}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-px bg-border">
        {[
          { href: `tel:${agent.phone}`, icon: <Phone className="h-4 w-4" />, label: "Call" },
          { href: `https://wa.me/${agent.whatsapp}`, icon: <MessageCircle className="h-4 w-4" />, label: "WhatsApp" },
          { href: `mailto:${agent.email}`, icon: <Mail className="h-4 w-4" />, label: "Email" },
        ].map((a) => (
          <motion.a
            key={a.label}
            whileHover={{ backgroundColor: "rgba(27,107,58,0.08)" }}
            href={a.href}
            target={a.label === "WhatsApp" ? "_blank" : undefined}
            rel={a.label === "WhatsApp" ? "noreferrer" : undefined}
            className="flex flex-col items-center gap-1 bg-card/60 py-4 text-[#1C2024] transition-colors hover:text-gold"
          >
            {a.icon}<span className="text-[10px] uppercase tracking-wider">{a.label}</span>
          </motion.a>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-3 p-6">
        <input required placeholder="Your name" className="w-full rounded-lg border border-border bg-charcoal/40 px-4 py-2.5 text-sm text-[#1C2024] placeholder:text-muted-foreground transition-all focus:border-gold focus:shadow-[0_0_15px_rgba(27,107,58,0.1)] focus:outline-none" />
        <input required type="email" placeholder="Email address" className="w-full rounded-lg border border-border bg-charcoal/40 px-4 py-2.5 text-sm text-[#1C2024] placeholder:text-muted-foreground transition-all focus:border-gold focus:shadow-[0_0_15px_rgba(27,107,58,0.1)] focus:outline-none" />
        <textarea rows={3} defaultValue={`I'd like to know more about ${property}.`} className="w-full resize-none rounded-lg border border-border bg-charcoal/40 px-4 py-2.5 text-sm text-[#1C2024] placeholder:text-muted-foreground transition-all focus:border-gold focus:shadow-[0_0_15px_rgba(27,107,58,0.1)] focus:outline-none" />
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-shimmer relative w-full rounded-full bg-gradient-gold py-3 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal shadow-gold">
          <span className="relative z-10">{sent ? "Request sent ✓" : "Request a viewing"}</span>
        </motion.button>
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
      <h3 className="mt-1 font-display text-2xl text-[#1C2024]">Estimate monthly payment</h3>
      <div className="mt-6 space-y-4">
        <SliderInput label="Down payment" value={downPct} onChange={setDownPct} min={0} max={80} step={1} suffix="%" />
        <SliderInput label="Interest rate" value={rate} onChange={setRate} min={1} max={12} step={0.1} suffix="%" />
        <SliderInput label="Term" value={years} onChange={setYears} min={5} max={40} step={1} suffix=" yrs" />
      </div>
      <div className="mt-6 rounded-xl border border-gold/30 bg-gold/10 p-5 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">Estimated monthly</p>
        <p className="mt-1 font-display text-4xl text-[#1C2024]">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(monthly || 0)}</p>
      </div>
    </div>
  );
}

function SliderInput({ label, value, onChange, min, max, step, suffix }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; suffix: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="text-[#1C2024]">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[var(--gold)]" />
    </div>
  );
}

/* ── Google Maps 3D Mini Map (replaces Mapbox) ─── */
function GoogleMiniMap({ lat, lng, type, title }: { lat: number; lng: number; type: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    let cancelled = false;
    loadGoogleMaps().then((g: any) => {
      if (cancelled || !ref.current) return;
      const map = new g.maps.Map(ref.current, {
        center: { lat, lng },
        zoom: 18,
        mapTypeId: "hybrid",
        tilt: 45,
        heading: 90,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: { position: g.maps.ControlPosition.RIGHT_BOTTOM },
        gestureHandling: "cooperative",
      });
      new g.maps.Marker({
        position: { lat, lng },
        map,
        icon: propertyMarkerIcon(type as any, true),
        title,
        animation: g.maps.Animation.DROP,
      });
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [lat, lng, type, title]);
  return <div ref={ref} className="h-full w-full" />;
}
