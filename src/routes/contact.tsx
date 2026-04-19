import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ArrowRight, Sparkles, Globe2, ShieldCheck } from "lucide-react";
import { TEAM, OFFICES } from "@/data/team";
import { AgentFlipCard } from "@/components/AgentFlipCard";
import { ContactForm } from "@/components/ContactForm";
import { OfficeMap } from "@/components/OfficeMap";
import { ClientOnly } from "@/components/ClientOnly";
import type { ReactNode } from "react";
import { useLang, t } from "@/lib/i18n";

const SERVICE_IMG = "/dl-assets/at your service.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Agents — SHAMS EL MEDINA" },
      { name: "description", content: "Speak with a senior SHAMS EL MEDINA advisor. Meet our team of private client specialists across Benslimane, Casablanca and beyond." },
      { property: "og:title", content: "Contact & Agents — SHAMS EL MEDINA" },
      { property: "og:description", content: "Meet the SHAMS EL MEDINA team and reach out to a senior advisor." },
    ],
  }),
  component: ContactPage,
});

/* ── Scroll reveal ── */
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ContactPage() {
  const [activeOffice, setActiveOffice] = useState(0);
  const office = OFFICES[activeOffice];
  const lang = useLang((s) => s.lang);

  return (
    <div className="bg-charcoal pt-28">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Subtle background */}
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(27,107,58,0.04) 0%, transparent 70%)", zIndex: 0 }} />

        {/* Floating orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <motion.div
            animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -left-32 top-1/3 h-72 w-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(27,107,58,0.06) 0%, transparent 70%)" }}
          />
          <motion.div
            animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -right-20 top-10 h-60 w-60 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(27,107,58,0.04) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1600px] px-6 py-16 lg:px-12 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left content */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mb-5 inline-flex items-center gap-3 rounded-full border border-gold/20 bg-gold/5 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-gold"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                </span>
                {t("contact.speak", lang)}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-xl font-display text-5xl leading-[1.1] text-cream sm:text-6xl md:text-7xl"
              >
                {t("contact.service", lang)}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.5 }}
                className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground"
              >
                Whether you're acquiring, divesting or simply exploring — our advisors are reachable directly,
                globally, and in confidence.
              </motion.p>

              {/* Quick contact row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mt-10 flex flex-wrap gap-3"
              >
                {[
                  { icon: <Phone className="h-4 w-4" />, text: "+212 5 23 29 XX XX" },
                  { icon: <Mail className="h-4 w-4" />, text: "contact@shams-elmedina.ma" },
                  { icon: <Clock className="h-4 w-4" />, text: "Lun–Ven 9h–19h" },
                ].map((item) => (
                  <span
                    key={item.text}
                    className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-2.5 text-xs font-medium text-cream backdrop-blur-sm transition-all hover:border-gold/40 hover:shadow-[0_0_20px_rgba(27,107,58,0.08)]"
                  >
                    <span className="text-gold">{item.icon}</span>
                    {item.text}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — Service image with premium treatment */}
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="overflow-hidden rounded-3xl border border-border/50 shadow-luxe">
                <motion.img
                  initial={{ scale: 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  src={SERVICE_IMG}
                  alt="Our team at your service"
                  className="aspect-[4/3] w-full object-cover"
                />
                {/* Subtle bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#f7faf7]/30 via-transparent to-transparent" />
              </div>

              {/* Gold corner accents */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="absolute -right-3 -top-3 h-20 w-20 rounded-br-3xl border-r-2 border-t-2 border-gold/30"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="absolute -bottom-3 -left-3 h-16 w-16 rounded-tl-3xl border-b-2 border-l-2 border-gold/20"
              />

              {/* Floating stat badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-4 -right-4 rounded-2xl border border-border bg-white p-4 shadow-luxe md:-bottom-6 md:-right-6 md:p-5"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">Client satisfaction</p>
                <p className="mt-1 font-display text-2xl text-cream md:text-3xl">98%</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">Since 1998</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ VALUE PROPS ═══ */}
      <section className="border-b border-border bg-[#f0f5f1]/60">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-0 divide-y divide-border md:grid-cols-3 md:gap-0 md:divide-x md:divide-y-0">
            {[
              { icon: <Globe2 className="h-6 w-6" />, title: "Global reach", desc: "Coverage across Benslimane, Casablanca, and international markets" },
              { icon: <ShieldCheck className="h-6 w-6" />, title: "Full discretion", desc: "Every conversation is handled with absolute confidentiality" },
              { icon: <Sparkles className="h-6 w-6" />, title: "Senior advisors", desc: "Each advisor personally vets every residence they represent" },
            ].map((v) => (
              <Reveal key={v.title}>
                <div className="flex items-start gap-4 p-8 md:p-10">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gold/15 bg-gold/5 text-gold">
                    {v.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-cream">{v.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT FORM + OFFICE ═══ */}
      <section className="mx-auto max-w-[1600px] px-6 py-24 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,1fr]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-col gap-6">
              {/* Office switcher */}
              <div className="flex flex-wrap gap-2">
                {OFFICES.map((o, i) => (
                  <motion.button
                    key={o.city}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveOffice(i)}
                    className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                      i === activeOffice
                        ? "border-gold bg-gold text-white shadow-gold"
                        : "border-border bg-white text-cream hover:border-gold/60 hover:bg-[#f0f5f1]"
                    }`}
                  >
                    {o.city}{o.isHeadquarters && <span className="ml-1.5 text-[9px] opacity-70">HQ</span>}
                  </motion.button>
                ))}
              </div>

              {/* Map */}
              <div className="overflow-hidden rounded-3xl border border-border shadow-luxe" style={{ height: 360 }}>
                <ClientOnly fallback={<div className="flex h-full items-center justify-center bg-[#f0f5f1] text-xs uppercase tracking-[0.28em] text-muted-foreground">Loading…</div>}>
                  <OfficeMap key={office.city} lat={office.lat} lng={office.lng} label={`SHAMS EL MEDINA · ${office.city}`} />
                </ClientOnly>
              </div>

              {/* Office details */}
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-border bg-white p-6 shadow-luxe"
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
          </Reveal>
        </div>
      </section>

      {/* ═══ LIFESTYLE IMAGE — warm human touch ═══ */}
      <section className="mx-auto max-w-[1600px] px-6 pb-12 lg:px-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border shadow-luxe" style={{ height: 420 }}>
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"
              alt="Luxury real estate consultation"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071a07]/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-10 md:p-14">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#78D88B]">Personal service</p>
              <h3 className="max-w-md font-display text-3xl leading-tight text-white md:text-4xl">
                Every client relationship begins with <em className="not-italic text-[#78D88B]">listening</em>.
              </h3>
              <p className="mt-3 max-w-sm text-sm text-white/70">
                Our advisors take the time to understand your vision — not just your requirements.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ TEAM ═══ */}
      <section className="border-t border-border bg-[#f0f5f1]/50 py-24">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <Reveal>
            <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                  <span className="h-px w-8 bg-gold" />
                  The advisors
                </p>
                <h2 className="font-display text-5xl leading-tight text-cream md:text-6xl">
                  Meet our <em className="not-italic gold-text-gradient">team</em>
                </h2>
                <p className="mt-4 max-w-xl text-muted-foreground">
                  Six senior advisors. Six markets. Each one personally vets every residence they represent.
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Hover or tap any card to reveal contact <ArrowRight className="ml-1 inline h-3 w-3" />
              </p>
            </div>
          </Reveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {TEAM.map((agent, i) => (
              <motion.div
                key={agent.id}
                variants={{ hidden: { opacity: 0, y: 30, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } } }}
              >
                <AgentFlipCard agent={agent} index={i} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA STRIP ═══ */}
      <section className="mx-auto max-w-[1600px] px-6 pb-28 pt-24 lg:px-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#eaf2eb] via-white to-[#e8f0e9] p-12 text-center shadow-luxe md:p-20">
            <div className="absolute inset-0 bg-mesh opacity-50" />
            {/* Rotating accent */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-10"
              style={{ background: "conic-gradient(from 0deg, transparent, rgba(27,107,58,0.4), transparent)" }}
            />
            <div className="relative">
              <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                <span className="h-px w-8 bg-gold" />
                Selling instead?
              </p>
              <h2 className="mx-auto max-w-3xl font-display text-4xl leading-tight text-cream md:text-6xl">
                Discreet <em className="not-italic gold-text-gradient">representation</em> for trophy properties.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
                Off-market introductions, white-glove marketing, qualified buyer pools across six continents.
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:listings@luxestate.com"
                className="btn-shimmer relative mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-gold px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-gold"
              >
                <span className="relative z-10">Request a private valuation</span>
                <ArrowRight className="relative z-10 h-4 w-4" />
              </motion.a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function Detail({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-gold">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
