import { MapPinned } from "lucide-react";

export function MapboxMissingNotice() {
  return (
    <div className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-card/40 p-10 text-center grain">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
        <MapPinned className="h-7 w-7" />
      </div>
      <h3 className="font-display text-3xl text-cream">Live map ready to connect</h3>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
        Add your Mapbox public access token as <code className="rounded bg-muted px-1.5 py-0.5 text-gold">VITE_MAPBOX_TOKEN</code> to
        unlock the interactive map, geocoding search and clustering. Free tier available at{" "}
        <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noreferrer" className="text-gold underline-offset-4 hover:underline">
          mapbox.com
        </a>.
      </p>
      <pre className="mt-6 rounded-lg border border-border bg-charcoal/60 px-4 py-3 text-left text-xs text-muted-foreground">
        VITE_MAPBOX_TOKEN=pk.your_public_token_here
      </pre>
    </div>
  );
}
