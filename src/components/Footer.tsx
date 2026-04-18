import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Linkedin, Send } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <footer className="relative overflow-hidden bg-navy/40 pt-24 grain">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="grid gap-16 pb-16 lg:grid-cols-[1.4fr,1fr,1fr,1fr]">
          <div>
            <Link to="/" className="flex items-baseline gap-1">
              <span className="font-display text-3xl text-cream">LUXESTATE</span>
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            </Link>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              A private collection of the world's most exceptional residences,
              estates and investment properties — represented with discretion since 1998.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
              className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-border bg-card/40 p-1.5 pr-1.5"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Subscribe to The Luxe Letter"
                className="flex-1 bg-transparent px-4 py-2 text-sm text-cream placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                className="btn-shimmer relative inline-flex h-9 items-center gap-2 rounded-full bg-gradient-gold px-4 text-xs font-semibold uppercase tracking-wider text-charcoal"
              >
                <span className="relative z-10">{done ? "Subscribed" : "Subscribe"}</span>
                {!done && <Send className="relative z-10 h-3.5 w-3.5" />}
              </button>
            </form>
          </div>

          <FooterCol title="Discover" links={[["Buy", "/listings"], ["Rent", "/listings"], ["Land", "/listings"], ["Map Search", "/map"]]} />
          <FooterCol title="Company" links={[["About", "/"], ["Agents", "/"], ["Press", "/"], ["Careers", "/"]]} />
          <FooterCol title="Legal" links={[["Privacy", "/"], ["Terms", "/"], ["Cookies", "/"], ["Sitemap", "/"]]} />
        </div>

        <div className="gold-divider" />

        <div className="flex flex-col items-center justify-between gap-4 py-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} LUXESTATE Holdings. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="transition-colors hover:text-gold"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter" className="transition-colors hover:text-gold"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="LinkedIn" className="transition-colors hover:text-gold"><Linkedin className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">{title}</h4>
      <ul className="space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link to={href} className="text-sm text-cream/70 transition-colors hover:text-cream">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
