/**
 * Centralized Mapbox token + helper that warns gracefully if missing.
 * Set VITE_MAPBOX_TOKEN in your environment (or in Lovable's env settings).
 * Get one free at: https://account.mapbox.com/access-tokens/
 */
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

export function hasMapboxToken(): boolean {
  return Boolean(MAPBOX_TOKEN && MAPBOX_TOKEN.startsWith("pk."));
}
