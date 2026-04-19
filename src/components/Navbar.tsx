import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { useUI } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { LangSwitcher } from "@/components/LangSwitcher";
import { useLang, t } from "@/lib/i18n";

function useNavLinks() {
  const lang = useLang((s) => s.lang);
  return [
    { to: "/", label: t("nav.home", lang) },
    { to: "/listings", label: t("nav.buy", lang) },
    { to: "/listings", label: t("nav.rent", lang), search: { listingType: "rent" as const } },
    { to: "/listings", label: t("nav.land", lang), search: { type: "land" as const } },
    { to: "/map", label: t("nav.mapSearch", lang) },
    { to: "/contact", label: t("nav.contact", lang) },
  ] as const;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { mobileMenu, setMobileMenu } = useUI();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const transparent = path === "/" && !scrolled;
  const lang = useLang((s) => s.lang);
  const LINKS = useNavLinks();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileMenu(false); }, [path, setMobileMenu]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          transparent
            ? "border-b border-[#1B6B3A]/10 bg-[#e8f0e9]/80 backdrop-blur-2xl backdrop-saturate-150"
            : "border-b border-[#1B6B3A]/15 bg-[#e4ede5]/95 shadow-[0_1px_8px_rgba(27,107,58,0.06)] backdrop-blur-2xl backdrop-saturate-150"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link to="/" className="group flex items-baseline gap-1">
            <span className="logo-premium font-display text-xl tracking-tight lg:text-2xl font-semibold">
              SHAMS EL MEDINA
            </span>
            <motion.span
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="h-2 w-2 rounded-full bg-gold"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l, i) => {
              const isActive = path === l.to || (l.to !== "/" && path.startsWith(l.to));
              return (
                <Link
                  key={`${l.label}-${i}`}
                  to={l.to}
                  className="group relative text-[13px] font-medium uppercase tracking-[0.18em] text-cream/80 transition-colors hover:text-cream"
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-500 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA + Lang */}
          <div className="hidden items-center gap-3 lg:flex">
            <LangSwitcher />
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/listings"
                className="btn-shimmer relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-charcoal transition-all hover:shadow-[0_0_30px_rgba(27,107,58,0.3)]"
              >
                <span className="relative z-10">{t("nav.listProperty", lang)}</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile hamburger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileMenu(true)}
            className="rounded-full border border-border p-2.5 text-cream transition-colors hover:border-gold hover:text-gold lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.header>

      {/* ── Mobile Menu ── */}
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
            {/* Decorative */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -right-48 -top-48 h-96 w-96 rounded-full opacity-10"
                style={{ background: "conic-gradient(from 0deg, transparent, rgba(27,107,58,0.4), transparent)" }}
              />
            </div>

            <div className="relative flex h-20 items-center justify-between px-6">
              <span className="logo-premium font-display text-xl font-semibold">
                SHAMS EL MEDINA<span className="text-gold">.</span>
              </span>
              <div className="flex items-center gap-3">
                <LangSwitcher />
                <motion.button
                  whileTap={{ scale: 0.9, rotate: 90 }}
                  aria-label="Close menu"
                  onClick={() => setMobileMenu(false)}
                  className="rounded-full border border-border p-2.5 text-cream"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            <nav className="relative flex flex-1 flex-col items-start gap-4 px-8 pt-8">
              {LINKS.map((l, i) => (
                <motion.div
                  key={`${l.label}-${i}`}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={l.to}
                    className="group flex items-center gap-3 font-display text-4xl text-cream transition-colors hover:text-gold sm:text-5xl"
                  >
                    {l.label}
                    <ArrowRight className="h-5 w-5 text-gold/0 transition-all group-hover:text-gold group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8"
              >
                <Link
                  to="/listings"
                  className="btn-shimmer relative inline-flex items-center justify-center rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-charcoal"
                >
                  <span className="relative z-10">{t("nav.listProperty", lang)}</span>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
