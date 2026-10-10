import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { reversePlace, searchPlaces, type Place } from '../../lib/geocoding';

export interface Pin {
  latitude: number;
  longitude: number;
}

// Nairobi CBD, where the map opens before the customer sets a pin.
const NAIROBI: [number, number] = [-1.2841, 36.8233];

// A CSS pin instead of Leaflet's default image marker, whose image paths break under Vite.
const pinIcon = L.divIcon({
  className: '',
  html: '<span style="display:block;width:28px;height:28px;border-radius:50% 50% 50% 0;background:#587649;border:3px solid #fffdf8;transform:rotate(-45deg);box-shadow:0 4px 10px rgba(43,37,24,.35)"></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

// Indexed by GeolocationPositionError.code; 0 is the fallback.
const LOCATION_ERRORS: Record<number, string> = {
  0: "We couldn't get your location. Search or tap the map instead.",
  1: 'Location access is blocked for this site. Allow it in your browser’s site settings (tap the icon beside the web address), or search or tap the map instead.',
  2: "Your device couldn't work out where you are. Check that location services are switched on, or search or tap the map instead.",
  3: 'Finding your location took too long. Try again outside or near a window, or search or tap the map instead.',
};

function ClickToPin({ onPick }: { onPick: (pin: Pin) => void }) {
  useMapEvents({ click: (e) => onPick({ latitude: e.latlng.lat, longitude: e.latlng.lng }) });
  return null;
}

function FlyTo({ pin }: { pin: Pin | null }) {
  const map = useMap();
  useEffect(() => {
    if (pin) map.flyTo([pin.latitude, pin.longitude], Math.max(map.getZoom(), 16), { duration: 0.6 });
  }, [map, pin]);
  return null;
}

interface LocationPickerProps {
  value: Pin | null;
  onChange: (pin: Pin) => void;
  /** Called with the street/area found at the pin, so the address fields can be prefilled. */
  onPlaceFound?: (place: Place) => void;
}

export default function LocationPicker({ value, onChange, onPlaceFound }: LocationPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [flyTarget, setFlyTarget] = useState<Pin | null>(null);
  const lookupTimer = useRef<number | undefined>(undefined);
  const lastSetHere = useRef<Pin | null>(value);

  // A pin set from outside (e.g. choosing a saved address) moves the map to it.
  useEffect(() => {
    if (value && value !== lastSetHere.current) {
      lastSetHere.current = value;
      setFlyTarget(value);
    }
  }, [value]);

  // Look up the address at a dropped pin, debounced so dragging doesn't flood the geocoder.
  const setPin = (pin: Pin, fly = false) => {
    lastSetHere.current = pin;
    onChange(pin);
    if (fly) setFlyTarget(pin);
    window.clearTimeout(lookupTimer.current);
    lookupTimer.current = window.setTimeout(async () => {
      const place = await reversePlace(pin.latitude, pin.longitude).catch(() => null);
      if (place) onPlaceFound?.(place);
    }, 800);
  };

  useEffect(() => () => window.clearTimeout(lookupTimer.current), []);

  const search = async () => {
    if (query.trim().length < 3) return;
    setSearching(true);
    try {
      const places = await searchPlaces(query.trim());
      setResults(places);
      if (places.length === 0) toast.error('No matching places. Try a nearby landmark or estate name.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Location search failed.');
    } finally {
      setSearching(false);
    }
  };

  const locateMe = () => {
    if (!window.isSecureContext || !navigator.geolocation) {
      toast.error("This browser can't share your location here. Search or tap the map instead.");
      return;
    }
    setLocating(true);
    // Precise GPS first; laptops and indoor phones often can't get a fix, so fall back to
    // the faster network-based position instead of failing.
    const attempt = (precise: boolean) =>
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocating(false);
          setPin({ latitude: position.coords.latitude, longitude: position.coords.longitude }, true);
          if (position.coords.accuracy > 150) {
            toast(`Pin placed within about ${Math.round(position.coords.accuracy)} m of you. Drag it to your exact gate.`, {
              icon: '📍',
              duration: 6000,
            });
          }
        },
        (error) => {
          if (precise && error.code !== error.PERMISSION_DENIED) return attempt(false);
          setLocating(false);
          toast.error(LOCATION_ERRORS[error.code] ?? LOCATION_ERRORS[0], { duration: 8000 });
        },
        { enableHighAccuracy: precise, timeout: precise ? 8000 : 15000, maximumAge: 60000 },
      );
    attempt(true);
  };

  const searchOnEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    // This sits inside the checkout form, so Enter must not submit the order.
    if (e.key === 'Enter') {
      e.preventDefault();
      search();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex flex-1 gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={searchOnEnter}
            enterKeyHint="search"
            placeholder="Search estate, street or landmark"
            className="min-w-0 flex-1 rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
          <button
            type="button"
            onClick={search}
            disabled={searching}
            className="flex items-center gap-1.5 rounded-xl bg-sage-600 px-4 text-sm font-semibold text-cream-50 transition hover:bg-sage-700 disabled:opacity-50"
          >
            <Search size={15} /> {searching ? 'Searching…' : 'Search'}
          </button>
        </div>
        <button
          type="button"
          onClick={locateMe}
          disabled={locating}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-sage-400 px-4 py-2.5 text-sm font-semibold text-sage-800 transition hover:bg-sage-50 disabled:opacity-60"
        >
          <Crosshair size={15} className={locating ? 'animate-spin' : ''} /> {locating ? 'Finding you…' : 'Use my location'}
        </button>
      </div>

      {results.length > 0 && (
        <ul className="overflow-hidden rounded-xl border border-cream-300 bg-cream-50 text-sm">
          {results.map((place) => (
            <li key={`${place.latitude},${place.longitude}`}>
              <button
                type="button"
                onClick={() => {
                  setPin(place, true);
                  setResults([]);
                }}
                className="w-full px-4 py-2.5 text-left text-ink-700 transition hover:bg-sage-50"
              >
                {place.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative z-0 h-72 overflow-hidden rounded-2xl border border-cream-300">
        <MapContainer
          center={value ? [value.latitude, value.longitude] : NAIROBI}
          zoom={value ? 16 : 12}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToPin onPick={(pin) => setPin(pin)} />
          <FlyTo pin={flyTarget} />
          {value && (
            <Marker
              position={[value.latitude, value.longitude]}
              icon={pinIcon}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = (e.target as L.Marker).getLatLng();
                  setPin({ latitude: lat, longitude: lng });
                },
              }}
            />
          )}
        </MapContainer>
      </div>
      <p className="text-xs text-ink-600">
        {value ? 'Drag the pin to your exact gate if it’s not quite right.' : 'Tap the map to drop a pin where you’d like delivery.'}
      </p>
    </div>
  );
}
