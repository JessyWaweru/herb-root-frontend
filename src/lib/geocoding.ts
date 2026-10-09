// Free OpenStreetMap geocoding (Nominatim). Its usage policy allows about one request a
// second and forbids search-as-you-type, so only call these on an explicit search or pin drop.
const NOMINATIM = 'https://nominatim.openstreetmap.org';

export interface Place {
  label: string;
  latitude: number;
  longitude: number;
  road: string;
  area: string;
  city: string;
  county: string;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: Record<string, string>;
}

function toPlace(result: NominatimResult): Place {
  const a = result.address ?? {};
  return {
    label: result.display_name,
    latitude: parseFloat(result.lat),
    longitude: parseFloat(result.lon),
    road: [a.house_number, a.road].filter(Boolean).join(' '),
    area: a.suburb || a.neighbourhood || a.quarter || a.village || '',
    city: a.city || a.town || a.municipality || a.village || '',
    county: (a.county || a.state || '').replace(/ County$/, ''),
  };
}

export async function searchPlaces(query: string): Promise<Place[]> {
  const params = new URLSearchParams({ q: query, format: 'jsonv2', addressdetails: '1', countrycodes: 'ke', limit: '5' });
  const response = await fetch(`${NOMINATIM}/search?${params}`, { headers: { 'Accept-Language': 'en' } });
  if (!response.ok) throw new Error('Location search is unavailable right now.');
  return ((await response.json()) as NominatimResult[]).map(toPlace);
}

export async function reversePlace(latitude: number, longitude: number): Promise<Place | null> {
  const params = new URLSearchParams({ lat: String(latitude), lon: String(longitude), format: 'jsonv2', addressdetails: '1', zoom: '18' });
  const response = await fetch(`${NOMINATIM}/reverse?${params}`, { headers: { 'Accept-Language': 'en' } });
  if (!response.ok) return null;
  const result = (await response.json()) as NominatimResult & { error?: string };
  return result.error ? null : toPlace(result);
}
