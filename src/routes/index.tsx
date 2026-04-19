import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, ArrowRight, Award, Globe2, ShieldCheck, Sparkles, Star, Quote, MapPin, Play } from "lucide-react";
import { ClientOnly } from "@/components/ClientOnly";
import { HeroScene } from "@/components/HeroScene";
import { HeroSearch } from "@/components/HeroSearch";
import { PropertyCard } from "@/components/PropertyCard";
import { PROPERTIES } from "@/data/properties";
import { useLang, t } from "@/lib/i18n";
import { BrandWatermark } from "@/components/BrandWatermark";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SHAMS EL MEDINA — Find your dream property" },
      { name: "description", content: "An ultra-luxury real estate marketplace featuring private estates, villas and exceptional residences in Benslimane and beyond." },
      { property: "og:title", content: "SHAMS EL MEDINA — Find your dream property" },
      { property: "og:description", content: "Discover the most exceptional residences in Shams El Medina." },
    ],
  }),
  component: HomePage,
});

/* ── Animation Variants ──────── */
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ── Scroll-reveal wrapper ──── */
function Reveal({ children, className = "", delay = 0, direction = "up" }: { children: ReactNode; className?: string; delay?: number; direction?: "up" | "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const initial = direction === "up" ? { y: 60 } : direction === "left" ? { x: -60 } : { x: 60 };
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...initial }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...initial }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Animated Counter ──────── */
function AnimCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      start = Math.round(target * eased * 10) / 10;
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {prefix}{typeof target === "number" && target % 1 !== 0 ? display.toFixed(1) : Math.round(display)}{suffix}
    </span>
  );
}

/* ── Magnetic button effect ── */
function MagneticButton({ children, className = "", ...props }: React.ComponentProps<typeof Link>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div style={{ x: springX, y: springY }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <Link ref={ref} className={className} {...props}>{children}</Link>
    </motion.div>
  );
}

const HEADLINE = "Shams El Medina";

function StaggeredHeading() {
  const words = HEADLINE.split(" ");
  return (
    <div className="overflow-hidden">
      <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-cream sm:text-6xl md:text-7xl lg:text-[7.5rem]">
        {words.map((word, wi) => (
          <span key={wi} className="mr-[0.25em] inline-block whitespace-nowrap">
            {word.split("").map((ch, ci) => (
              <motion.span
                key={ci}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.3 + (wi * 5 + ci) * 0.03, ease: [0.22, 1, 0.36, 1] }}
                className={`inline-block ${wi === words.length - 1 ? "gold-text-gradient" : ""}`}
              >
                {ch}
              </motion.span>
            ))}
          </span>
        ))}
      </h1>

      {/* Rotating brand logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 flex items-center justify-center gap-4"
      >
        <svg className="animate-spin-slow h-24 w-24 sm:h-28 sm:w-28" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 7 rounded circular petals — matching Shams El Medina brand logo */}
          {[0, 51.4, 102.8, 154.3, 205.7, 257.1, 308.6].map((angle, i) => {
            const colors = ["#8BC34A", "#66BB6A", "#43A047", "#2E7D32", "#388E3C", "#4CAF50", "#7CB342"];
            return (
              <g key={i} transform={`rotate(${angle} 100 100)`}>
                {/* Rounded teardrop: circle top + tapered bottom toward center */}
                <circle cx="100" cy="42" r="16" fill={colors[i]} />
                <path
                  d="M84 42 Q84 72, 96 90 Q100 96, 104 90 Q116 72, 116 42"
                  fill={colors[i]}
                />
              </g>
            );
          })}
          {/* Center white circle */}
          <circle cx="100" cy="100" r="18" fill="#f7faf7" />
        </svg>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 font-display text-4xl tracking-wide sm:text-5xl md:text-6xl lg:text-7xl font-semibold"
        style={{ direction: "rtl", color: "#1B6B3A" }}
      >
        شمس المدينة
      </motion.p>
    </div>
  );
}

/* ══════════════════════ PROPERTY TYPES SHOWCASE ══════════════════════ */
const PROPERTY_TYPES = [
  {
    id: "eco",
    title: "Appartements Économiques",
    specs: [
      "Superficie : de 59 jusqu'à 62 m²",
      "2 chambres, salon, cuisine",
      "Salle de bain et balcon",
    ],
  },
  {
    id: "lots",
    title: "Lots de Terrain",
    specs: [
      "R+2 : de 96 jusqu'à 120 m²",
      "R+3 : de 130 jusqu'à 174 m²",
      "R+4 : de 180 jusqu'à 193 m²",
    ],
  },
  {
    id: "villas",
    title: "Villas",
    specs: [
      "Terrain : de 199 jusqu'à 399 m²",
      "Construction : à partir de 130 m²",
      "Sous sol inclus",
    ],
  },
  {
    id: "moyen",
    title: "Appartements Moyen-Standing",
    specs: [
      "Superficie : 90 m²",
      "2 chambres, 2 salons, cuisine",
      "Vue sur grand boulevard et Golf",
    ],
  },
];

function PropertyTypesShowcase() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const images = [
    new URL("../benslimane-01.jpg", import.meta.url).href,
    new URL("../benslimane-02.jpg", import.meta.url).href,
    new URL("../benslimane-04.jpg", import.meta.url).href,
    new URL("../benslimane-06.jpg", import.meta.url).href,
  ];

  // Auto-advance every 5s
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setActive((a) => (a + 1) % PROPERTY_TYPES.length);
          return 0;
        }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [active]);

  const item = PROPERTY_TYPES[active];

  return (
    <div className="flex gap-8" style={{ flexDirection: "row" }}>
      {/* LEFT — Tabs */}
      <div className="flex flex-col gap-3" style={{ width: "40%", minWidth: 300 }}>
        {PROPERTY_TYPES.map((type, i) => (
          <motion.button
            key={type.id}
            onClick={() => { setActive(i); setProgress(0); }}
            className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-500 ${
              i === active
                ? "border-[#1B6B3A]/30 bg-[#1B6B3A]/[0.07] shadow-[0_4px_20px_rgba(27,107,58,0.08)]"
                : "border-border hover:border-[#1B6B3A]/20 hover:bg-[#1B6B3A]/[0.02]"
            }`}
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-4 px-6 py-5">
              {/* Number badge */}
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 ${
                i === active
                  ? "bg-[#1B6B3A] text-white shadow-[0_4px_12px_rgba(27,107,58,0.3)]"
                  : "bg-[#1B6B3A]/10 text-[#1B6B3A]"
              }`}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-base font-semibold leading-tight transition-colors ${i === active ? "text-[#1B6B3A]" : "text-cream"}`}>
                  {type.title}
                </p>
              </div>
              {/* Arrow indicator */}
              <motion.div
                animate={{ rotate: i === active ? 90 : 0, scale: i === active ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
                className={`shrink-0 transition-colors ${i === active ? "text-[#1B6B3A]" : "text-muted-foreground"}`}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </div>

            {/* Expanded specs */}
            <AnimatePresence>
              {i === active && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 border-t border-[#1B6B3A]/10 px-6 pb-5 pt-4 pl-[76px]">
                    {type.specs.map((spec, si) => (
                      <motion.p
                        key={si}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: si * 0.1, duration: 0.35 }}
                        className="flex items-center gap-2.5 text-sm text-muted-foreground"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#1B6B3A]/50" />
                        {spec}
                      </motion.p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress bar */}
            {i === active && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-2xl bg-[#1B6B3A]/10">
                <motion.div
                  className="h-full rounded-b-2xl bg-[#1B6B3A]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* RIGHT — Image carousel */}
      <div className="relative overflow-hidden rounded-2xl border border-border" style={{ flex: 1, minHeight: 420 }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={item.id}
            src={images[active]}
            alt={item.title}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#051205]/80 via-[#051205]/15 to-transparent" />

        {/* Bottom overlay */}
        <div className="absolute inset-x-0 bottom-0 p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8BC34A]">
                Shams El Medina · Benslimane
              </p>
              <h3 className="font-display text-3xl text-white">{item.title}</h3>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide dots */}
        <div className="absolute right-5 top-5 flex gap-2">
          {PROPERTY_TYPES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setProgress(0); }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════ HOME ══════════════════════ */
function HomePage() {
  const featured = PROPERTIES.filter((p) => p.isFeatured).slice(0, 6);
  const fresh = PROPERTIES.slice(6, 12);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const lang = useLang((s) => s.lang);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative isolate flex min-h-screen flex-col overflow-hidden" style={{ background: "#f7faf7" }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(27,107,58,0.04) 0%, transparent 70%)" }} />
        <ClientOnly>
          <HeroScene />
        </ClientOnly>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f7faf7]/50 to-transparent" />

        {/* Floating orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, -50, 0], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -left-32 top-1/4 h-96 w-96 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(27,107,58,0.08) 0%, transparent 70%)" }}
          />
          <motion.div
            animate={{ x: [0, -80, 0], y: [0, 60, 0], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -right-32 top-1/3 h-[500px] w-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(27,107,58,0.06) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col items-center justify-center px-6 pt-24 text-center lg:px-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-gold/20 bg-gold/5 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-gold backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            A private collection · est. 1998
          </motion.p>

          <StaggeredHeading />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            From cliffside villas in Benslimane to penthouses in Casablanca —
            curated residences for those who require nothing less than exceptional.
          </motion.p>

          <div className="mt-12 flex w-full justify-center px-2">
            <HeroSearch />
          </div>
        </div>


      </section>

      {/* ═══ TYPE DE BIENS — interactive property types showcase ═══ */}
      <section className="relative border-y border-border py-20 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 30% 50%, rgba(27,107,58,0.03) 0%, transparent 60%)" }} />
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <Reveal>
            <div className="mb-10 text-center">
              <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                <span className="h-px w-8 bg-gold" />
                {t("section.projects", lang)}
                <span className="h-px w-8 bg-gold" />
              </p>
              <h2 className="font-display text-4xl leading-tight text-cream md:text-5xl">
                {t("section.typeBiens", lang)}
              </h2>
            </div>
          </Reveal>
          <PropertyTypesShowcase />
        </div>
      </section>

      {/* ═══ FEATURED RESIDENCES — staggered grid ═══ */}
      <section className="relative mx-auto max-w-[1600px] px-6 py-28 lg:px-12">
        <div className="mb-14 flex items-start justify-between gap-8">
          <Reveal direction="left">
            <div>
              <motion.p
                className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold"
              >
                <span className="h-px w-8 bg-gold" />
                {t("section.collection", lang)}
              </motion.p>
              <h2 className="font-display text-5xl leading-tight text-cream md:text-6xl">
                {t("section.featured", lang)}
              </h2>
              <p className="mt-4 max-w-lg text-sm text-cream/50 leading-relaxed">
                {t("section.featuredDesc", lang)}
              </p>
            </div>
          </Reveal>
          <div className="hidden shrink-0 flex-col items-center gap-4 lg:flex">
            <BrandWatermark />
            <MagneticButton to="/listings" className="group inline-flex items-center gap-3 rounded-full border border-border px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-cream/80 transition-all hover:border-gold hover:text-gold hover:shadow-[0_0_30px_rgba(27,107,58,0.15)]">
              View all properties
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {featured.map((p, i) => (
            <motion.div key={p.id} variants={fadeUp} custom={i}>
              <PropertyCard property={p} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══ LUXURY EXPERIENCE BANNER ═══ */}
      <section className="relative overflow-hidden bg-secondary py-32">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(27,107,58,0.03) 0%, transparent 60%)", zIndex: 0 }} />
        <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <Reveal direction="left">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                  <span className="h-px w-8 bg-gold" />
                  The Experience
                </p>
                <h2 className="font-display text-5xl leading-tight text-cream md:text-6xl">
                  Luxury is in the <em className="not-italic gold-text-gradient">details</em>
                </h2>
                <p className="mt-6 text-cream/60 leading-relaxed">
                  Every residence in our collection has been personally inspected by our team. 
                  We go beyond square footage to understand what makes a home truly exceptional.
                </p>

                <BrandWatermark className="mt-8" size="md" align="start" />

                <div className="mt-10 grid grid-cols-2 gap-4">
                  {FEATURES.map((f, i) => (
                    <Reveal key={f.title} delay={i * 0.1}>
                      <div className="group rounded-2xl border border-border/50 bg-card/20 p-5 transition-all duration-500 hover:border-gold/40 hover:bg-card/40 hover:shadow-[0_0_40px_rgba(27,107,58,0.08)]">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold transition-all duration-500 group-hover:bg-gold/20 group-hover:shadow-[0_0_20px_rgba(27,107,58,0.2)]">
                          {f.icon}
                        </div>
                        <p className="text-sm font-semibold text-cream">{f.title}</p>
                        <p className="mt-1 text-xs text-cream/50">{f.desc}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal direction="right" delay={0.2}>
              <div className="relative">
                <div className="overflow-hidden rounded-3xl border border-border/50">
                  <img
                    src="/dl-assets/luxury.jpg"
                    alt="Luxury real estate"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071a07]/60 via-transparent to-transparent" />
                </div>
                {/* Floating stat card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-6 -left-6 rounded-2xl border border-border bg-white p-5 shadow-luxe"
                  style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.08)" }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">Avg. Sale Price</p>
                  <p className="mt-1 font-display text-3xl text-cream">$4.2M</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-green-400">
                    <ArrowRight className="h-3 w-3 rotate-[-45deg]" />+12% this quarter
                  </p>
                </motion.div>
                {/* Gold corner accent */}
                <div className="absolute -right-3 -top-3 h-20 w-20 rounded-br-3xl border-r-2 border-t-2 border-gold/30" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ MAP CTA — premium glassmorphism ═══ */}
      <section className="relative overflow-hidden py-8">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-secondary p-10 shadow-luxe md:p-16">
              <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 70% 30%, rgba(27,107,58,0.04) 0%, transparent 60%)" }} />
              {/* Animated gradient orb */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-20"
                style={{ background: "conic-gradient(from 0deg, transparent, rgba(27,107,58,0.3), transparent)" }}
              />
              <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr,1fr]">
                <div>
                  <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                    <span className="h-px w-8 bg-gold" />
                    Explore globally
                  </p>
                  <h2 className="font-display text-4xl leading-tight text-cream md:text-6xl">
                    Search by <em className="not-italic gold-text-gradient">map</em>, not by guesswork.
                  </h2>
                  <p className="mt-6 max-w-xl text-muted-foreground">
                    Pan across continents with live filters. Click any property marker for an instant preview with 3D satellite view.
                  </p>
                  <MagneticButton to="/map" className="btn-shimmer relative mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-gold px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal shadow-gold">
                    <span className="relative z-10">Open the map</span>
                    <ArrowRight className="relative z-10 h-4 w-4" />
                  </MagneticButton>
                </div>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 gap-4"
                >
                  {[
                    { icon: <Award className="h-5 w-5" />, title: "Award-winning", desc: "Recognised by FT & Forbes" },
                    { icon: <Globe2 className="h-5 w-5" />, title: "Global reach", desc: "Six continents covered" },
                    { icon: <ShieldCheck className="h-5 w-5" />, title: "Verified listings", desc: "Every property vetted" },
                    { icon: <Sparkles className="h-5 w-5" />, title: "White-glove", desc: "End-to-end concierge" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      variants={scaleIn}
                      className="group rounded-2xl border border-border/50 bg-card/20 p-5 backdrop-blur-sm transition-all duration-500 hover:border-gold/40 hover:bg-card/40"
                    >
                      <div className="mb-3 text-gold transition-all duration-300 group-hover:scale-110">{item.icon}</div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-cream">{item.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ TESTIMONIALS — auto-rotating ═══ */}
      <section className="relative overflow-hidden py-28">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <Reveal>
            <div className="mb-16 text-center">
              <BrandWatermark className="mx-auto mb-6 flex" />
              <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                <span className="h-px w-8 bg-gold" />
                Testimonials
                <span className="h-px w-8 bg-gold" />
              </p>
              <h2 className="font-display text-5xl text-cream md:text-6xl">
                What our <em className="not-italic gold-text-gradient">clients</em> say
              </h2>
            </div>
          </Reveal>

          <div className="relative mx-auto max-w-4xl">
            <AnimatePresence mode="wait">
              {TESTIMONIALS.map((t, i) => i === activeTestimonial && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center"
                >
                  <Quote className="mx-auto mb-6 h-10 w-10 text-gold/30" />
                  <p className="font-display text-2xl leading-relaxed text-cream md:text-3xl">
                    "{t.quote}"
                  </p>
                  <div className="mt-8 flex flex-col items-center gap-3">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="text-sm font-semibold text-cream">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Dots */}
            <div className="mt-10 flex justify-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === activeTestimonial ? "w-8 bg-gold" : "w-2 bg-cream/20 hover:bg-cream/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FRESH ARRIVALS — staggered grid ═══ */}
      <section className="relative mx-auto max-w-[1600px] px-6 py-28 lg:px-12">
        <div className="mb-14 flex items-start justify-between gap-8">
          <Reveal direction="left">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                <span className="h-px w-8 bg-gold" />
                Just arrived
              </p>
              <h2 className="font-display text-5xl leading-tight text-cream md:text-6xl">
                Fresh <em className="not-italic gold-text-gradient">arrivals</em>
              </h2>
            </div>
          </Reveal>
          <BrandWatermark className="hidden shrink-0 lg:flex" />
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {fresh.map((p, i) => (
            <motion.div key={p.id} variants={fadeUp} custom={i}>
              <PropertyCard property={p} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══ FINAL CTA — full-width ═══ */}
      <section className="relative overflow-hidden bg-secondary py-32">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(27,107,58,0.04) 0%, transparent 60%)", zIndex: 0 }} />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
          style={{ background: "conic-gradient(from 0deg, transparent, rgba(27,107,58,0.4), transparent, rgba(27,107,58,0.2), transparent)" }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <BrandWatermark className="mx-auto mb-4 flex" />
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
              <span className="h-px w-8 bg-gold" />
              Begin your journey
              <span className="h-px w-8 bg-gold" />
            </p>
            <h2 className="font-display text-5xl leading-tight text-cream md:text-7xl">
              Your next <em className="not-italic gold-text-gradient">home</em> awaits
            </h2>
            <p className="mt-6 text-muted-foreground">
              Let our team of specialists guide you to the residence that matches your vision, lifestyle, and aspirations.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <MagneticButton
                to="/listings"
                className="btn-shimmer relative inline-flex items-center gap-3 rounded-full bg-gradient-gold px-10 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-charcoal shadow-gold"
              >
                <span className="relative z-10">Browse residences</span>
                <ArrowRight className="relative z-10 h-4 w-4" />
              </MagneticButton>
              <MagneticButton
                to="/contact"
                className="inline-flex items-center gap-3 rounded-full border border-border px-10 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-cream transition-all hover:border-gold hover:text-gold hover:shadow-[0_0_30px_rgba(27,107,58,0.1)]"
              >
                Speak to an agent
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ── Data ──────────── */
const FEATURES = [
  { icon: <ShieldCheck className="h-5 w-5" />, title: "Verified Properties", desc: "Every listing personally inspected" },
  { icon: <Globe2 className="h-5 w-5" />, title: "Global Network", desc: "Partners in 62+ countries" },
  { icon: <Award className="h-5 w-5" />, title: "Award Winning", desc: "Forbes & FT recognised agency" },
  { icon: <Sparkles className="h-5 w-5" />, title: "Concierge Service", desc: "White-glove from search to close" },
];

const TESTIMONIALS = [
  {
    quote: "Shams El Medina found us our dream villa in Benslimane within two weeks. Their attention to detail and understanding of our needs was extraordinary.",
    name: "Sarah & Ahmed El Fassi",
    role: "Homeowners, Shems Al Madina",
  },
  {
    quote: "The map search feature is revolutionary – I could explore properties in real-time before even visiting. The 3D satellite view sealed the deal.",
    name: "Jean-Pierre Moreau",
    role: "Investor, Casablanca",
  },
  {
    quote: "From the first consultation to handing over the keys, Shams El Medina delivered a flawless experience. True white-glove service.",
    name: "Fatima Zahra Bennani",
    role: "Villa Owner, Benslimane",
  },
  {
    quote: "We've worked with agencies worldwide, but Shams El Medina's combination of technology and personal touch is unmatched in Morocco.",
    name: "David & Lisa Chen",
    role: "International Buyers",
  },
];

function StatCard({ n, suffix = "", prefix = "", label, icon }: { n: number; suffix?: string; prefix?: string; label: string; icon: ReactNode }) {
  return (
    <div className="group text-center lg:text-left">
      <div className="mb-4 flex justify-center lg:justify-start">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/20 bg-gold/5 text-gold transition-all duration-500 group-hover:border-gold/40 group-hover:bg-gold/10 group-hover:shadow-[0_0_30px_rgba(27,107,58,0.15)]">
          {icon}
        </div>
      </div>
      <p className="font-display text-5xl text-cream md:text-6xl">
        <AnimCounter target={n} suffix={suffix} prefix={prefix} />
      </p>
      <div className="my-3 mx-auto h-px w-12 bg-gradient-to-r from-transparent via-gold/60 to-transparent lg:mx-0 lg:from-gold/60 lg:via-gold/30 lg:to-transparent" />
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
    </div>
  );
}
