import { useNavigate } from 'react-router-dom';
import { matchSymptomSlugs } from '../lib/symptomMatcher';
import { useSymptoms } from './useProducts';

/** Routes free text to /shop, mapping recognized concerns (e.g. "my head hurts") to a
 * multi-symptom smart match, and falling back to a plain keyword search otherwise. */
export function useSmartSearchNavigate() {
  const navigate = useNavigate();
  const { data: symptoms } = useSymptoms();

  return (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      navigate('/shop');
      return;
    }

    const knownSlugs = new Set(symptoms?.map((s) => s.slug));
    const matches = matchSymptomSlugs(trimmed).filter((m) => knownSlugs.has(m.slug));

    if (matches.length > 0) {
      const params = new URLSearchParams({ concerns: matches.map((m) => m.slug).join(','), q: trimmed });
      navigate(`/shop?${params.toString()}`);
    } else {
      navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
    }
  };
}
