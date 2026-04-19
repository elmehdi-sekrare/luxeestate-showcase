import { useState } from "react";
import { Phone, Mail, MessageCircle, MapPin, Languages, Award } from "lucide-react";
import { motion } from "framer-motion";
import type { TeamAgent } from "@/data/team";

interface Props {
  agent: TeamAgent;
  index?: number;
}

export function AgentFlipCard({ agent, index = 0 }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: (index % 6) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group [perspective:1500px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onFocus={() => setFlipped(true)}
      onBlur={() => setFlipped(false)}
    >
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        aria-label={`Reveal contact details for ${agent.name}`}
        className="relative block aspect-[3/4] w-full text-left transition-transform duration-700 [transform-style:preserve-3d] focus:outline-none"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-border bg-card/40 [backface-visibility:hidden]">
          <img
            src={agent.photo}
            alt={agent.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051205]/90 via-[#051205]/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">{agent.title}</p>
            <h3 className="font-display text-3xl text-white">{agent.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-white/70">
              <MapPin className="h-3 w-3 text-gold" />
              {agent.city}
            </p>
          </div>
          <div className="absolute right-4 top-4 rounded-full border border-gold/40 bg-charcoal/60 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-gold backdrop-blur">
            Tap to flip
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border border-gold/30 bg-navy/80 p-6 [backface-visibility:hidden] grain"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="absolute inset-0 bg-mesh opacity-60" />
          <div className="relative flex h-full flex-col">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">{agent.title}</p>
              <h3 className="mt-1 font-display text-2xl text-cream">{agent.name}</h3>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-cream/80">{agent.bio}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Stat icon={<Award className="h-3.5 w-3.5" />} label="Closed" value={agent.closedVolume} />
              <Stat icon={<Award className="h-3.5 w-3.5" />} label="Experience" value={`${agent.yearsExperience} yrs`} />
            </div>

            <div className="mt-3 flex items-start gap-2 text-xs text-cream/70">
              <Languages className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
              <span>{agent.languages.join(" · ")}</span>
            </div>

            <div className="mt-auto grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
              <ContactBtn href={`tel:${agent.phone}`} icon={<Phone className="h-4 w-4" />} label="Call" />
              <ContactBtn href={`https://wa.me/${agent.whatsapp}`} icon={<MessageCircle className="h-4 w-4" />} label="WhatsApp" external />
              <ContactBtn href={`mailto:${agent.email}`} icon={<Mail className="h-4 w-4" />} label="Email" />
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-charcoal/40 p-3">
      <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <span className="text-gold">{icon}</span>{label}
      </p>
      <p className="mt-1 font-display text-lg text-cream">{value}</p>
    </div>
  );
}

function ContactBtn({ href, icon, label, external }: { href: string; icon: React.ReactNode; label: string; external?: boolean }) {
  return (
    <a
      href={href}
      onClick={(e) => e.stopPropagation()}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="flex flex-col items-center gap-1 bg-charcoal/60 py-3 text-cream transition-colors hover:text-gold"
    >
      {icon}
      <span className="text-[9px] uppercase tracking-wider">{label}</span>
    </a>
  );
}
