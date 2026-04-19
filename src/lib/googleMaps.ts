export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

declare global {
  interface Window {
    google?: any;
    __luxestateGoogleMapsPromise?: Promise<any>;
  }
}

export function hasGoogleMapsToken(): boolean {
  return Boolean(GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.length > 10);
}

export function loadGoogleMaps() {
  if (typeof window === "undefined") return Promise.reject(new Error("Google Maps can only load in the browser."));
  if (window.google?.maps) return Promise.resolve(window.google);
  if (window.__luxestateGoogleMapsPromise) return window.__luxestateGoogleMapsPromise;
  if (!GOOGLE_MAPS_API_KEY) return Promise.reject(new Error("Missing VITE_GOOGLE_MAPS_API_KEY."));

  window.__luxestateGoogleMapsPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-luxestate-google-maps="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}&libraries=geometry,places`;
    script.async = true;
    script.defer = true;
    script.dataset.luxestateGoogleMaps = "true";
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("Failed to load Google Maps."));
    document.head.appendChild(script);
  });

  return window.__luxestateGoogleMapsPromise;
}

export const googleMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#F5F7F6" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4A5D52" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#FFFFFF" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#D4DDD7" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#EDF2EE" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#E4EBE5" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6B8C72" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#FFFFFF" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#D4DDD7" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#5A6D5F" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#E4EBE5" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#C8DDD0" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#5A7D64" }] },
];

export function goldMarkerIcon(google: any, scale = 1) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8 * scale,
    fillColor: "#1B6B3A",
    fillOpacity: 1,
    strokeColor: "#FFFFFF",
    strokeWeight: 3,
  };
}

export function propertyMarkerIcon(type: "house" | "villa" | "land" | "commercial", selected = false) {
  const styles = {
    villa: {
      bg: selected ? "#F5F0E8" : "#121018",
      accent: "#D8B85D",
      shape:
        '<path d="M16 4 27 16.5 16 36 5 16.5 16 4Z"/><path d="M9.5 18 16 10l6.5 8H20v8h-8v-8H9.5Z" fill="CURRENT"/>',
      label: "V",
    },
    house: {
      bg: selected ? "#F5F0E8" : "#10141C",
      accent: "#6DD3FF",
      shape:
        '<path d="M16 3.5 29 14.5 25.5 35H6.5L3 14.5 16 3.5Z"/><path d="M9.5 18 16 12.2 22.5 18v9.5H18v-6h-4v6H9.5V18Z" fill="CURRENT"/>',
      label: "H",
    },
    land: {
      bg: selected ? "#F5F0E8" : "#0F1913",
      accent: "#78D88B",
      shape:
        '<path d="M4.5 8.5h23v19.8L16 36 4.5 28.3V8.5Z"/><path d="M7.5 26 12 15l5 7 3-4 5 8H7.5Z" fill="CURRENT"/>',
      label: "L",
    },
    commercial: {
      bg: selected ? "#F5F0E8" : "#17130E",
      accent: "#F6A85D",
      shape:
        '<path d="M7 5h18v30H7V5Z"/><path d="M11 11h3v3h-3v-3Zm7 0h3v3h-3v-3Zm-7 7h3v3h-3v-3Zm7 0h3v3h-3v-3Zm-4 8h4v9h-4v-9Z" fill="CURRENT"/>',
      label: "C",
    },
  };
  const cfg = styles[type];
  const glyphColor = selected ? "#FFFFFF" : cfg.accent;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="64" viewBox="0 0 32 40">
      <filter id="shadow" x="-30%" y="-20%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="2.2" flood-color="#000000" flood-opacity="0.55"/>
      </filter>
      <g filter="url(#shadow)">
        <g fill="${cfg.bg}" stroke="${cfg.accent}" stroke-width="${selected ? 2.6 : 2}">
          ${cfg.shape.replace("CURRENT", glyphColor)}
        </g>
        <circle cx="24.5" cy="10" r="5.2" fill="${cfg.accent}" stroke="#FFFFFF" stroke-width="1.4"/>
        <text x="24.5" y="12.4" text-anchor="middle" font-family="Arial, sans-serif" font-size="6.5" font-weight="800" fill="#FFFFFF">${cfg.label}</text>
      </g>
    </svg>
  `;
  const icon: { url: string; scaledSize?: any; anchor?: any } = {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
  };
  if (window.google?.maps) {
    icon.scaledSize = new window.google.maps.Size(selected ? 58 : 50, selected ? 66 : 58);
    icon.anchor = new window.google.maps.Point(selected ? 29 : 25, selected ? 62 : 56);
  }
  return icon;
}

export function userLocationIcon(selected = false) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62">
      <circle cx="31" cy="31" r="25" fill="rgba(56,189,248,0.22)" stroke="#38BDF8" stroke-width="2.5"/>
      <circle cx="31" cy="31" r="16" fill="#1A2E40" stroke="#38BDF8" stroke-width="2.5"/>
      <path d="M31 15 38 38l-7-3.4-7 3.4 7-23Z" fill="#38BDF8" stroke="#1A2E40" stroke-width="1"/>
      <circle cx="31" cy="31" r="4" fill="#38BDF8"/>
    </svg>
  `;
  const icon: { url: string; scaledSize?: any; anchor?: any } = {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
  };
  if (window.google?.maps) {
    icon.scaledSize = new window.google.maps.Size(selected ? 62 : 54, selected ? 62 : 54);
    icon.anchor = new window.google.maps.Point(selected ? 31 : 27, selected ? 31 : 27);
  }
  return icon;
}
