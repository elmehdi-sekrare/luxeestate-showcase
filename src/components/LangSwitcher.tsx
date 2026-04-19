import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import { useLang, type Lang } from "@/lib/i18n";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇲🇦" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export function LangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.code === lang)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-[#1B6B3A]/15 bg-[#1B6B3A]/5 px-3 py-1.5 text-xs font-medium text-cream transition-all hover:border-[#1B6B3A]/30 hover:bg-[#1B6B3A]/10"
      >
        <Globe className="h-3.5 w-3.5 text-[#1B6B3A]" />
        <span>{current.flag}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[49]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full z-[50] mt-2 w-40 overflow-hidden rounded-xl border border-[#1B6B3A]/15 bg-[#f7faf7] shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
            >
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setOpen(false); }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-all hover:bg-[#1B6B3A]/5 ${
                    l.code === lang ? "bg-[#1B6B3A]/10 font-semibold text-[#1B6B3A]" : "text-[#1C2024]"
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
