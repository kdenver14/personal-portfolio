/** Geometry for the dot globe: where the sun is overhead, how lit a place is, and an orthographic view. */

export interface GeoPoint {
  /** Degrees east. */
  readonly lon: number;
  /** Degrees north. */
  readonly lat: number;
}

export type Vec3 = readonly [number, number, number];

export interface Projected {
  /** Screen offsets from the globe's centre, in radii; y grows downward. */
  readonly x: number;
  readonly y: number;
  /** Depth toward the viewer: above 0 on the visible face, 1 at its centre. */
  readonly z: number;
}

const RADIANS = Math.PI / 180;
const MS_PER_DAY = 86_400_000;
const MINUTES_PER_HOUR = 60;
const DEGREES_PER_HOUR = 15;
const SOLAR_NOON_UTC = 12;
/** Cooper's approximation of the sun's declination: tilt × sin(2π(284 + day) / 365). */
const AXIAL_TILT = 23.44;
const DECLINATION_OFFSET_DAYS = 284;
const DAYS_PER_YEAR = 365;
/** How sharply day turns to night at the terminator; higher is a narrower twilight band. */
const TWILIGHT_SHARPNESS = 4;
const HALF = 0.5;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** The point where the sun is straight overhead at `date`. Accurate to about a degree, plenty for a picture. */
export function subsolarPoint(date: Date): GeoPoint {
  const dayOfYear = (date.getTime() - Date.UTC(date.getUTCFullYear(), 0, 0)) / MS_PER_DAY;
  const lat = AXIAL_TILT * Math.sin((2 * Math.PI * (DECLINATION_OFFSET_DAYS + dayOfYear)) / DAYS_PER_YEAR);
  const hours = date.getUTCHours() + date.getUTCMinutes() / MINUTES_PER_HOUR;
  return { lon: (SOLAR_NOON_UTC - hours) * DEGREES_PER_HOUR, lat };
}

export function toVector({ lon, lat }: GeoPoint): Vec3 {
  const cosLat = Math.cos(lat * RADIANS);
  return [cosLat * Math.cos(lon * RADIANS), cosLat * Math.sin(lon * RADIANS), Math.sin(lat * RADIANS)];
}

const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** How lit a place is, from 0 (night) to 1 (day), with a soft twilight band at the terminator. */
export function daylight(place: Vec3, sun: Vec3): number {
  return clamp01(dot(place, sun) * TWILIGHT_SHARPNESS + HALF);
}

export function isNight(place: GeoPoint, date: Date): boolean {
  return dot(toVector(place), toVector(subsolarPoint(date))) < 0;
}

/** Where `place` falls on a globe seen from straight above `view`. */
export function orthographic(place: GeoPoint, view: GeoPoint): Projected {
  const dLon = (place.lon - view.lon) * RADIANS;
  const lat = place.lat * RADIANS;
  const viewLat = view.lat * RADIANS;
  return {
    x: Math.cos(lat) * Math.sin(dLon),
    y: -(Math.cos(viewLat) * Math.sin(lat) - Math.sin(viewLat) * Math.cos(lat) * Math.cos(dLon)),
    z: Math.sin(viewLat) * Math.sin(lat) + Math.cos(viewLat) * Math.cos(lat) * Math.cos(dLon),
  };
}
