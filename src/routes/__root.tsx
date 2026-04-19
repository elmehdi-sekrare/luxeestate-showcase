import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LuxeCursor } from "@/components/LuxeCursor";
import { ChatWidget } from "@/components/ChatWidget";
import { useLang } from "@/lib/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-gold">404</h1>
        <h2 className="mt-4 font-display text-2xl text-cream">A residence not found</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you sought has been moved, sold, or never listed.
        </p>
        <div className="mt-8">
          <a href="/" className="btn-shimmer relative inline-flex items-center justify-center rounded-full bg-gradient-gold px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal">
            <span className="relative z-10">Return home</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SHAMS EL MEDINA — A private collection of the world's finest properties" },
      { name: "description", content: "An ultra-luxury real estate marketplace featuring private estates, villas, penthouses and exceptional residences across the globe." },
      { name: "author", content: "SHAMS EL MEDINA" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "SHAMS EL MEDINA — Find your dream property" },
      { property: "og:description", content: "Discover the world's most exceptional residences." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const lang = useLang((s) => s.lang);

  // Update html lang + dir when language changes
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }

  return (
    <>
      <LuxeCursor />
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
