import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { TEAM, OFFICES } from "@/data/team";
import { AgentFlipCard } from "@/components/AgentFlipCard";
import { ContactForm } from "@/components/ContactForm";
import { OfficeMap } from "@/components/OfficeMap";
import { ClientOnly } from "@/components/ClientOnly";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Agents — LUXESTATE" },
      { name: "description", content: "Speak with a senior LUXESTATE advisor. Meet our team of private client specialists across New York, London, Paris and beyond." },
      { property: "og:title", content: "Contact & Agents — LUXESTATE" },
      { property: "og:description", content: "Meet the LUXESTATE team and reach out to a senior advisor." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80&auto=format&fit=crop" },
      { name: "twitter:image", content: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80&auto=format&fit=crop" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [activeOffice, setActiveOffice] = useState(0);
  const office = OFFICES[activeOffice];

  return (
    <div className="bg-charcoal pt-28">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border grain">
        <div className="absolute inset-0 bg-mesh opacity-90" />
        <div className="relative mx-auto max-w-[1600px] px-6 py-20 text-center lg:px-12 lg:py-28">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-5 inline-flex items-center gap-3 rounded-full border border-gold/30 bg-charcoal/40 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-gold backdrop-blur"
          >
            <span className="h-1 w-1 rounded-full bg-gold" /> Speak with a private advisor
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-4xl font-display text-5xl leading-[0.98] text-cream sm:text-6xl md:text-7xl lg:text-[6.5rem]"
          >
            Quietly <em className="not-italic gold-text-gradient">at your service</em>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mx-auto mt-6 max-w-xl text-cream/70"
          >
            Whether you're acquiring, divesting or simply exploring — our advisors are reachable directly,
            globally, and in confidence.
          </motion.p>
        </div>
      </section>

      {/* CONTACT + OFFICE */}
      <section className="mx-auto max-w-[1600px] px-6 py-24 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,1fr]">
          <ContactForm />

          <div className="flex flex-col gap-6">
            {/* Office switcher */}
            <div className="flex flex-wrap gap-2">
              {OFFICES.map((o, i) => (
                <button
                  key={o.city}
                  onClick={() => setActiveOffice(i)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
                    i === activeOffice
                      ? "border-gold bg-gold text-charcoal"
                      : "border-border bg-card/30 text-cream hover:border-gold/60"
                  }`}
                >
                  {o.city}{o.isHeadquarters && <span className="ml-1.5 text-[9px] opacity-70">HQ</span>}
                </button>
              ))}
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-3xl border border-border" style={{ height: 360 }}>
              <ClientOnly fallback={<div className="flex h-full items-center justify-center bg-navy/30 text-xs uppercase tracking-[0.28em] text-muted-foreground">Loading…</div>}>
                <OfficeMap key={office.city} lat={office.lat} lng={office.lng} label={`LUXESTATE · ${office.city}`} />
              </ClientOnly>
            </div>

            {/* Office details */}
            <motion.div
              key={office.city}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-border bg-card/40 p-6 grain"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
                {office.isHeadquarters ? "Global headquarters" : "Regional office"}
              </p>
              <h3 className="mt-1 font-display text-3xl text-cream">{office.city}</h3>
              <div className="mt-5 space-y-3 text-sm text-cream/80">
                <Detail icon={<MapPin className="h-4 w-4" />} text={office.address} />
                <Detail icon={<Phone className="h-4 w-4" />} text={office.phone} />
                <Detail icon={<Mail className="h-4 w-4" />} text={`${office.city.toLowerCase().replace(/\s+/g, "")}@luxestate.com`} />
                <Detail icon={<Clock className="h-4 w-4" />} text="Mon – Fri · 9:00 – 19:00 (local)" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="border-t border-border bg-navy/20 py-24 grain">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">The advisors</p>
              <h2 className="font-display text-5xl leading-tight text-cream md:text-6xl">
                Meet our <em className="not-italic gold-text-gradient">team</em>
              </h2>
              <p className="mt-4 max-w-xl text-cream/70">
                Six senior advisors. Six markets. Each one personally vets every residence they represent.
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Hover or tap any card to reveal contact <ArrowRight className="ml-1 inline h-3 w-3" />
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((agent, i) => (
              <AgentFlipCard key={agent.id} agent={agent} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="mx-auto max-w-[1600px] px-6 pb-28 pt-24 lg:px-12">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-navy/60 via-charcoal to-navy/40 p-12 text-center md:p-20 grain">
          <div className="absolute inset-0 bg-mesh opacity-50" />
          <div className="relative">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Selling instead?</p>
            <h2 className="mx-auto max-w-3xl font-display text-4xl leading-tight text-cream md:text-6xl">
              Discreet <em className="not-italic gold-text-gradient">representation</em> for trophy properties.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-cream/70">
              Off-market introductions, white-glove marketing, qualified buyer pools across six continents.
            </p>
            <a
              href="mailto:listings@luxestate.com"
              className="btn-shimmer relative mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-gold px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal shadow-gold"
            >
              <span className="relative z-10">Request a private valuation</span>
              <ArrowRight className="relative z-10 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function Detail({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-gold">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
