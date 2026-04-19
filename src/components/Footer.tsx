import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Linkedin, Facebook, Send, ArrowUpRight, Heart, Phone, Mail, MapPin, Clock, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-border bg-secondary pt-24">
      {/* Decorative top gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Floating gold orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-32 top-16 h-96 w-96 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(27,107,58,0.1) 0%, transparent 70%)" }}
      />
      <motion.div
        animate={{ y: [0, 15, 0], opacity: [0.03, 0.07, 0.03] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-48 bottom-24 h-72 w-72 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(27,107,58,0.08) 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* ══ TOP SECTION — Logo + tagline + newsletter ══ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col items-center text-center"
        >
          {/* Animated premium logo */}
          <Link to="/" className="group flex items-baseline gap-1.5">
            <span className="logo-premium font-display text-3xl font-semibold tracking-tight lg:text-4xl">
              SHAMS EL MEDINA
            </span>
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="h-2.5 w-2.5 rounded-full bg-gold"
            />
          </Link>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Une collection privée de résidences et propriétés exceptionnelles à Benslimane et au-delà. 
            L'excellence immobilière depuis 2020.
          </p>

          {/* Newsletter */}
          <form
            onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
            className="mt-8 flex w-full max-w-md items-center gap-2 rounded-full border border-border bg-white p-1.5 transition-all duration-300 focus-within:border-gold/50 focus-within:shadow-[0_0_30px_rgba(27,107,58,0.06)]"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email pour nos exclusivités"
              className="flex-1 bg-transparent px-4 py-2 text-sm text-[#1C2024] placeholder:text-muted-foreground focus:outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn-shimmer relative inline-flex h-9 items-center gap-2 rounded-full bg-gradient-gold px-4 text-xs font-semibold uppercase tracking-wider text-charcoal"
            >
              <span className="relative z-10">{done ? "Inscrit ✓" : "S'inscrire"}</span>
              {!done && <Send className="relative z-10 h-3.5 w-3.5" />}
            </motion.button>
          </form>
        </motion.div>

        {/* ══ MAIN GRID — 4 columns ══ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Column 1 — Discover */}
          <FooterCol
            title="Découvrir"
            links={[
              ["Acheter", "/listings"],
              ["Louer", "/listings"],
              ["Terrains", "/listings"],
              ["Recherche carte", "/map"],
              ["Types de biens", "/"],
            ]}
            delay={0.1}
            inView={isInView}
          />

          {/* Column 2 — Company */}
          <FooterCol
            title="Entreprise"
            links={[
              ["À propos", "/"],
              ["Notre équipe", "/contact"],
              ["Carrières", "/"],
              ["Contact", "/contact"],
            ]}
            delay={0.2}
            inView={isInView}
          />

          {/* Column 3 — Legal */}
          <FooterCol
            title="Juridique"
            links={[
              ["Confidentialité", "/"],
              ["Conditions", "/"],
              ["Cookies", "/"],
              ["Plan du site", "/"],
            ]}
            delay={0.3}
            inView={isInView}
          />

          {/* Column 4 — Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h4 className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-4 bg-gold/50" />
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/60" />
                <span>Benslimane, Route de Casablanca<br />Maroc</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-gold/60" />
                <a href="tel:+212523290000" className="transition-colors hover:text-cream">+212 5 23 29 XX XX</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-gold/60" />
                <a href="mailto:contact@shams-elmedina.ma" className="transition-colors hover:text-cream">contact@shams-elmedina.ma</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0 text-gold/60" />
                <span>Lun – Ven : 9h – 19h</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* ══ SOCIAL MEDIA BAR ══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col items-center justify-center gap-4 border-t border-border/50 py-8"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold/60">Suivez-nous</p>
          <div className="flex items-center gap-3">
            {[
              { icon: <Instagram className="h-4 w-4" />, label: "Instagram", href: "#" },
              { icon: <Facebook className="h-4 w-4" />, label: "Facebook", href: "#" },
              { icon: <Twitter className="h-4 w-4" />, label: "Twitter", href: "#" },
              { icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn", href: "#" },
              { icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>, label: "WhatsApp", href: "https://wa.me/212523290000" },
            ].map((s) => (
              <motion.a
                key={s.label}
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.95 }}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition-all hover:border-gold hover:text-gold hover:shadow-[0_0_20px_rgba(27,107,58,0.1)]"
              >
                {s.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* ══ BOTTOM BAR ══ */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col items-center justify-between gap-4 py-8 text-xs text-muted-foreground sm:flex-row"
        >
          <p className="inline-flex items-center gap-1.5">
            © {new Date().getFullYear()} Shams El Medina. Fait avec
            <Heart className="h-3 w-3 fill-gold/50 text-gold/50" />
            Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/" className="transition-colors hover:text-gold">Confidentialité</Link>
            <Link to="/" className="transition-colors hover:text-gold">Conditions</Link>
            <motion.button
              whileHover={{ y: -3 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-gold"
            >
              Haut de page <ArrowUpRight className="h-3 w-3" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links, delay, inView }: { title: string; links: [string, string][]; delay: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <h4 className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        <span className="h-px w-4 bg-gold/50" />
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              to={href}
              className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-all hover:text-cream hover:translate-x-1"
            >
              <ChevronRight className="h-3 w-3 text-gold/0 transition-all group-hover:text-gold/60" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
