import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, ChevronRight } from "lucide-react";

const QUICK_REPLIES = [
  {
    q: "Je veux visiter un bien",
    a: "Bien sûr ! Nos conseillers sont disponibles du lundi au vendredi de 9h à 19h. Appelez-nous au +212 5 23 29 XX XX ou envoyez un email à contact@shams-elmedina.ma pour planifier une visite.",
  },
  {
    q: "Quels sont les prix ?",
    a: "Nos biens commencent à partir de 350 000 DH pour les appartements économiques, et jusqu'à 3 000 000 DH+ pour les villas. Contactez-nous pour un devis personnalisé.",
  },
  {
    q: "Comment acheter à crédit ?",
    a: "Nous travaillons avec les principales banques marocaines pour vous offrir des facilités de paiement. Nos conseillers vous accompagnent dans toutes les démarches de financement.",
  },
  {
    q: "Où se situe le projet ?",
    a: "Shams El Medina est situé à Benslimane, à seulement 45 minutes de Casablanca. Un emplacement stratégique avec vue sur le Golf Royal et un accès direct aux grands boulevards.",
  },
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: "bot" | "user"; text: string }[]>([
    { from: "bot", text: "Bienvenue chez Shams El Medina 👋\nComment puis-je vous aider ?" },
  ]);
  const [input, setInput] = useState("");
  const [showQuick, setShowQuick] = useState(true);

  const handleQuick = (item: (typeof QUICK_REPLIES)[0]) => {
    setMessages((m) => [...m, { from: "user", text: item.q }, { from: "bot", text: item.a }]);
    setShowQuick(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((m) => [
      ...m,
      { from: "user", text: input },
      { from: "bot", text: "Merci pour votre message. Un conseiller vous répondra dans les plus brefs délais." },
    ]);
    setInput("");
    setShowQuick(false);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#1B6B3A] text-white shadow-[0_4px_20px_rgba(27,107,58,0.4)] transition-all hover:bg-[#145A32] hover:shadow-[0_6px_30px_rgba(27,107,58,0.5)]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: open ? 90 : 0 }}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </motion.button>

      {/* Pulse ring */}
      {!open && (
        <span className="fixed bottom-6 right-6 z-[59] h-14 w-14 animate-ping rounded-full bg-[#1B6B3A]/30" />
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-[60] flex w-[360px] flex-col overflow-hidden rounded-2xl border border-[#1B6B3A]/20 shadow-[0_12px_48px_rgba(0,0,0,0.12)]"
            style={{ height: 480, background: "#f7faf7" }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ background: "linear-gradient(135deg, #1B6B3A, #145A32)" }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Shams El Medina</p>
                <p className="text-[11px] text-white/70">En ligne · Réponse immédiate</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.from === "user"
                        ? "bg-[#1B6B3A] text-white rounded-br-sm"
                        : "bg-[#e8f0e9] text-[#1C2024] rounded-bl-sm"
                    }`}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Quick replies */}
              {showQuick && (
                <div className="space-y-1.5 pt-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7C72]">Suggestions</p>
                  {QUICK_REPLIES.map((item, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                      onClick={() => handleQuick(item)}
                      className="flex w-full items-center gap-2 rounded-xl border border-[#1B6B3A]/15 bg-white px-3.5 py-2.5 text-left text-xs text-[#1C2024] transition-all hover:border-[#1B6B3A]/30 hover:bg-[#1B6B3A]/[0.03]"
                    >
                      <ChevronRight className="h-3 w-3 shrink-0 text-[#1B6B3A]" />
                      {item.q}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-[#1B6B3A]/10 bg-white px-4 py-3">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Votre message..."
                  className="flex-1 rounded-full bg-[#f0f5f1] px-4 py-2.5 text-sm text-[#1C2024] placeholder:text-[#6B7C72] focus:outline-none focus:ring-1 focus:ring-[#1B6B3A]/30"
                />
                <button
                  type="submit"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1B6B3A] text-white transition-all hover:bg-[#145A32]"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
