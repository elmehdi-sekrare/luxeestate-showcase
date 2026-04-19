import { MapPin } from "lucide-react";

interface Props {
  lat: number;
  lng: number;
  zoom?: number;
  label?: string;
}

/** A styled mini map using Google Maps Embed (no API billing required). */
export function OfficeMap({ lat, lng, zoom = 14, label }: Props) {
  // Use Google Maps Embed API — works without billing on the JS API
  const q = label ? encodeURIComponent(label) : `${lat},${lng}`;
  const embedUrl = `https://www.google.com/maps?q=${q}&z=${zoom}&output=embed`;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a1a0a]">
      <iframe
        src={embedUrl}
        className="h-full w-full border-0 grayscale-[30%] contrast-[1.1]"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={label || "Map"}
        style={{ filter: "saturate(0.85) brightness(1.02)" }}
      />
      {/* Overlay with brand accent */}
      <div className="pointer-events-none absolute inset-0 border border-[#1B6B3A]/10" />
      {label && (
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-[#1B6B3A]/20 bg-white/95 px-3 py-1.5 text-xs font-medium text-[#1C2024] shadow-lg backdrop-blur">
          <MapPin className="h-3.5 w-3.5 text-[#1B6B3A]" />
          {label}
        </div>
      )}
    </div>
  );
}
