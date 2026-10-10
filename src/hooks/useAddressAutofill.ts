import { useRef } from 'react';
import type { Place } from '../lib/geocoding';

export type AutofillField = 'address_line1' | 'address_line2' | 'city' | 'county_or_state';

/**
 * Fills address fields from the place under the map pin.
 *
 * A field the pin filled is replaced every time the pin moves. A field the customer typed
 * (or that came from a saved address) is left alone, since it's usually more precise than
 * the map's road name.
 */
export function useAddressAutofill(
  getValue: (field: AutofillField) => string | undefined,
  setValue: (field: AutofillField, value: string) => void,
) {
  const lastFilled = useRef<Partial<Record<AutofillField, string>>>({});

  const fillFromPlace = (place: Place) => {
    const fromPlace: Record<AutofillField, string> = {
      address_line1: place.road,
      address_line2: place.area,
      city: place.city,
      county_or_state: place.county,
    };
    for (const field of Object.keys(fromPlace) as AutofillField[]) {
      const current = getValue(field) ?? '';
      const filledByPin = current !== '' && current === lastFilled.current[field];
      if (current === '' || filledByPin) {
        setValue(field, fromPlace[field]);
        lastFilled.current[field] = fromPlace[field];
      }
    }
  };

  // Call when the fields are loaded from somewhere else (e.g. a saved address), so they count as typed.
  const forget = () => {
    lastFilled.current = {};
  };

  return { fillFromPlace, forget };
}
