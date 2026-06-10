// SF neighborhoods with approximate centroids. Good enough for radius matching.
export const NEIGHBORHOODS: Record<string, { lat: number; lng: number }> = {
  'Mission': { lat: 37.7599, lng: -122.4148 },
  'Castro': { lat: 37.7609, lng: -122.435 },
  'Noe Valley': { lat: 37.7502, lng: -122.4337 },
  'Hayes Valley': { lat: 37.7759, lng: -122.4245 },
  'SoMa': { lat: 37.7785, lng: -122.4056 },
  'Marina': { lat: 37.8021, lng: -122.4369 },
  'North Beach': { lat: 37.8061, lng: -122.4103 },
  'Richmond': { lat: 37.7775, lng: -122.4744 },
  'Inner Sunset': { lat: 37.7637, lng: -122.4719 },
  'Haight-Ashbury': { lat: 37.77, lng: -122.4469 },
  'Bernal Heights': { lat: 37.7411, lng: -122.4156 },
  'Potrero Hill': { lat: 37.7605, lng: -122.4005 },
  'Nob Hill': { lat: 37.793, lng: -122.4161 },
  'Financial District': { lat: 37.7946, lng: -122.3999 }
};

export const NEIGHBORHOOD_NAMES = Object.keys(NEIGHBORHOODS);

const EARTH_RADIUS_MILES = 3958.8;

export function distanceMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(h));
}
