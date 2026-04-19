export const SHAMS_CENTER = { lat: 33.6167, lng: -7.1167 };
export const SHAMS_BOUNDS = {
  north: 33.6238,
  south: 33.6099,
  east: -7.1079,
  west: -7.1258,
};

export interface LocalPoint {
  localLat: number;
  localLng: number;
}

export function localPositionForIndex(index: number): LocalPoint {
  const cols = 6;
  const row = Math.floor(index / cols);
  const col = index % cols;
  const jitterLat = seededNoise(index, 1) * 0.0012;
  const jitterLng = seededNoise(index, 2) * 0.0014;
  const latStep = (SHAMS_BOUNDS.north - SHAMS_BOUNDS.south) / 5;
  const lngStep = (SHAMS_BOUNDS.east - SHAMS_BOUNDS.west) / 5;

  return {
    localLat: clamp(SHAMS_BOUNDS.south + ((row % 6) + 0.35) * latStep + jitterLat, SHAMS_BOUNDS.south, SHAMS_BOUNDS.north),
    localLng: clamp(SHAMS_BOUNDS.west + (col + 0.35) * lngStep + jitterLng, SHAMS_BOUNDS.west, SHAMS_BOUNDS.east),
  };
}

export function localPositionForPropertyId(id: string): LocalPoint {
  const parsed = Number.parseInt(id.replace(/\D/g, ""), 10);
  const index = Number.isFinite(parsed) && parsed > 0 ? parsed - 1 : 0;
  return localPositionForIndex(index);
}

function seededNoise(index: number, salt: number) {
  const value = Math.sin((index + 1) * 127.1 + salt * 311.7) * 43758.5453;
  return (value - Math.floor(value) - 0.5) * 2;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

