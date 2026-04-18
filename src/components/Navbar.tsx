import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useUI } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/listings", label: "Buy" },
  { to: "/listings", label: "Rent", search: { listingType: "rent" as const } },
  { to: "/listings", label: "Land", search: { type: "land" as const } },
  { to: "/map", label: "Map Search" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { mobileMenu, setMobileMenu } = useUI();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const transparent = path === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileMenu(false); }, [path, setMobileMenu]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          transparent
            ? "bg-transparent"
            : "glass-strong border-b border-border"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-12">
          <Link to="/" className="group flex items-baseline gap-1">
            <span className="font-display text-2xl tracking-tight text-cream lg:text-3xl">
              LUXESTATE
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold transition-all duration-500 group-hover:scale-150 group-hover:shadow-[0_0_12px_var(--gold)]" />
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="group relative text-[13px] font-medium uppercase tracking-[0.18em] text-cream/80 transition-colors hover:text-cream"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              to="/listings"
              className="btn-shimmer relative inline-flex items-center justify-center rounded-full bg-gradient-gold px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-charcoal transition-all hover:shadow-gold"
            >
              <span className="relative z-10">List your property</span>
            </Link>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileMenu(true)}
            className="rounded-full border border-border p-2.5 text-cream transition-colors hover:border-gold hover:text-gold lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] flex flex-col bg-charcoal/98 backdrop-blur-2xl lg:hidden grain"
          >
            <div className="flex h-20 items-center justify-between px-6">
              <span className="font-display text-2xl text-cream">LUXESTATE<span className="text-gold">.</span></span>
              <button
                aria-label="Close menu"
                onClick={() => setMobileMenu(false)}
                className="rounded-full border border-border p-2.5 text-cream"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col items-start gap-6 px-8 pt-8">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link to={l.to} className="font-display text-5xl text-cream hover:text-gold">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-6"
              >
                <Link
                  to="/listings"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-charcoal"
                >
                  List your property
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
