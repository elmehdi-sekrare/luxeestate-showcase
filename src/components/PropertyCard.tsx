import { Link } from "@tanstack/react-router";
import { Heart, BedDouble, Bath, Maximize, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, type MouseEvent } from "react";
import type { Property } from "@/data/properties";
import { formatPrice } from "@/data/properties";
import { useFavorites } from "@/store/useStore";
import { motion } from "framer-motion";

interface Props {
  property: Property;
  index?: number;
  tilt?: boolean;
}

export function PropertyCard({ property, index = 0, tilt = true }: Props) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [popHeart, setPopHeart] = useState(false);
  const fav = useFavorites((s) => s.ids.includes(property.id));
  const toggle = useFavorites((s) => s.toggle);

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!tilt || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateZ(0)`;
  };
  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  const next = (e: MouseEvent) => { e.preventDefault(); e.stopPropagation(); setImgIdx((i) => (i + 1) % property.images.length); };
  const prev = (e: MouseEvent) => { e.preventDefault(); e.stopPropagation(); setImgIdx((i) => (i - 1 + property.images.length) % property.images.length); };
  const onFav = (e: MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    toggle(property.id);
    setPopHeart(true);
    setTimeout(() => setPopHeart(false), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        ref={cardRef}
        to="/property/$id"
        params={{ id: property.id }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="tilt-card group relative block overflow-hidden rounded-2xl border border-border bg-card/40"
      >
        {/* Image carousel */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {property.images.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt={property.title}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                i === imgIdx ? "opacity-100 scale-100" : "opacity-0 scale-105"
              } group-hover:scale-110`}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />

          {/* Carousel controls */}
          {property.images.length > 1 && (
            <>
              <button onClick={prev} aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-charcoal/60 p-2 text-cream opacity-0 backdrop-blur transition-all hover:border-gold hover:text-gold group-hover:opacity-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={next} aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-charcoal/60 p-2 text-cream opacity-0 backdrop-blur transition-all hover:border-gold hover:text-gold group-hover:opacity-100">
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-20 left-1/2 flex -translate-x-1/2 gap-1.5">
                {property.images.map((_, i) => (
                  <span key={i} className={`h-1 rounded-full transition-all ${i === imgIdx ? "w-6 bg-gold" : "w-1.5 bg-cream/40"}`} />
                ))}
              </div>
            </>
          )}

          {/* Top badges */}
          <div className="absolute left-4 top-4 flex gap-2">
            <span className="rounded-full bg-charcoal/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream backdrop-blur">
              {property.type}
            </span>
            {property.listingType === "rent" && (
              <span className="rounded-full bg-gold/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal">
                For Rent
              </span>
            )}
            {property.isFeatured && (
              <span className="rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal">
                Featured
              </span>
            )}
          </div>

          {/* Favorite */}
          <button
            onClick={onFav}
            aria-label={fav ? "Remove from favorites" : "Save to favorites"}
            className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-charcoal/70 text-cream backdrop-blur transition-all hover:border-gold hover:text-gold ${popHeart ? "animate-heart-pop" : ""}`}
          >
            <Heart className={`h-4 w-4 transition-all ${fav ? "fill-gold text-gold" : ""}`} />
          </button>

          {/* Price */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <p className="font-display text-2xl text-cream">{formatPrice(property.price, property.listingType)}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <h3 className="font-display text-xl text-cream transition-colors group-hover:text-gold">{property.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 text-gold" />
            {property.neighborhood}, {property.city}
          </p>
          <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-xs text-cream/80">
            {property.beds > 0 && (
              <Spec icon={<BedDouble className="h-3.5 w-3.5" />} value={`${property.beds} bd`} />
            )}
            {property.baths > 0 && (
              <Spec icon={<Bath className="h-3.5 w-3.5" />} value={`${property.baths} ba`} />
            )}
            {property.sqft > 0 && (
              <Spec icon={<Maximize className="h-3.5 w-3.5" />} value={`${property.sqft.toLocaleString()} sqft`} />
            )}
            {property.type === "land" && property.lotSize > 0 && (
              <Spec icon={<Maximize className="h-3.5 w-3.5" />} value={`${property.lotSize} ac`} />
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Spec({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-gold/70">{icon}</span>
      {value}
    </span>
  );
}
