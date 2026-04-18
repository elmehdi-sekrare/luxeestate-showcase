import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, Award, Globe2, ShieldCheck } from "lucide-react";
import { ClientOnly } from "@/components/ClientOnly";
import { HeroScene } from "@/components/HeroScene";
import { HeroSearch } from "@/components/HeroSearch";
import { PropertyCard } from "@/components/PropertyCard";
import { PROPERTIES } from "@/data/properties";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LUXESTATE — Find your dream property" },
      { name: "description", content: "An ultra-luxury real estate marketplace featuring private estates, villas and exceptional residences across the globe." },
      { property: "og:title", content: "LUXESTATE — Find your dream property" },
      { property: "og:description", content: "Discover the world's most exceptional residences." },
    ],
  }),
  component: HomePage,
});

const HEADLINE = "Find Your Dream Property";

function StaggeredHeading() {
  const words = HEADLINE.split(" ");
  return (
    <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-cream sm:text-6xl md:text-7xl lg:text-[7.5rem]">
      {words.map((word, wi) => (
        <span key={wi} className="mr-[0.25em] inline-block whitespace-nowrap">
          {word.split("").map((ch, ci) => (
            <motion.span
              key={ci}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.3 + (wi * 5 + ci) * 0.03, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </h1>
  );
}

function HomePage() {
  const featured = PROPERTIES.filter((p) => p.isFeatured).slice(0, 6);
  const fresh = PROPERTIES.slice(6, 12);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-screen flex-col overflow-hidden bg-charcoal grain">
        <div className="absolute inset-0 bg-mesh opacity-90" />
        <ClientOnly>
          <HeroScene />
        </ClientOnly>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-charcoal to-transparent" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col items-center justify-center px-6 pt-24 text-center lg:px-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-gold/30 bg-charcoal/40 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-gold backdrop-blur"
          >
            <span className="h-1 w-1 rounded-full bg-gold" />
            A private collection · est. 1998
          </motion.p>

          <StaggeredHeading />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="mt-8 max-w-2xl text-base leading-relaxed text-cream/70 md:text-lg"
          >
            From cliffside villas in Portofino to penthouses above Central Park —
            curated residences for those who require nothing less than exceptional.
          </motion.p>

          <div className="mt-12 flex w-full justify-center px-2">
            <HeroSearch />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-cream/50"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.3em]">Scroll</span>
          <ChevronDown className="h-4 w-4 animate-bounce-slow" />
        </motion.div>
      </section>

      {/* SIGNATURE STATS */}
      <section className="relative border-y border-border bg-navy/30 py-20 grain">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 lg:grid-cols-4 lg:px-12">
          <Stat n="$8.4B" l="In transactions closed" />
          <Stat n="62" l="Countries represented" />
          <Stat n="2,400+" l="Private residences listed" />
          <Stat n="98%" l="Discretion guarantee" />
        </div>
      </section>

      {/* FEATURED RESIDENCES */}
      <section className="mx-auto max-w-[1600px] px-6 py-28 lg:px-12">
        <div className="mb-14 flex items-end justify-between gap-8">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">The Collection</p>
            <h2 className="font-display text-5xl leading-tight text-cream md:text-6xl">
              Featured <em className="not-italic gold-text-gradient">residences</em>
            </h2>
          </div>
          <Link to="/listings" className="group hidden items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-cream/80 hover:text-gold lg:inline-flex">
            View all properties
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      </section>

      {/* MAP CTA */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-navy/40 p-10 shadow-luxe md:p-16 grain">
            <div className="absolute inset-0 bg-mesh opacity-60" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr,1fr]">
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Explore globally</p>
                <h2 className="font-display text-4xl leading-tight text-cream md:text-6xl">
                  Search by <em className="not-italic gold-text-gradient">map</em>, not by guesswork.
                </h2>
                <p className="mt-6 max-w-xl text-cream/70">
                  Pan across continents with live filters. Cluster pins reveal neighborhoods,
                  click any marker for an instant glassmorphism preview.
                </p>
                <Link to="/map" className="btn-shimmer relative mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-gold px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal shadow-gold">
                  <span className="relative z-10">Open the map</span>
                  <ArrowRight className="relative z-10 h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[Award, Globe2, ShieldCheck, ArrowRight].map((Icon, i) => (
                  <div key={i} className="glass rounded-2xl p-5">
                    <Icon className="mb-3 h-5 w-5 text-gold" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-cream">
                      {["Award-winning", "Global reach", "Verified listings", "White-glove"][i]}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {["Recognised by FT & Forbes", "Six continents covered", "Every property vetted", "End-to-end concierge"][i]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FRESH ARRIVALS */}
      <section className="mx-auto max-w-[1600px] px-6 py-28 lg:px-12">
        <div className="mb-14 flex items-end justify-between gap-8">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Just arrived</p>
            <h2 className="font-display text-5xl leading-tight text-cream md:text-6xl">
              Fresh <em className="not-italic gold-text-gradient">arrivals</em>
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {fresh.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="text-center lg:text-left">
      <p className="font-display text-5xl text-cream md:text-6xl">{n}</p>
      <div className="my-3 h-px w-12 bg-gold/60 mx-auto lg:mx-0" />
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">{l}</p>
    </div>
  );
}
