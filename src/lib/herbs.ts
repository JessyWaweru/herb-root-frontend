import type { Ingredient } from '../types';

// Words that describe the part of the plant rather than the herb itself.
const PLANT_PARTS = /\b(root|leaf|leaves|flower|flowers|seed|bark)\b|\(.*?\)/g;

/** The ingredients a piece of writing mentions by name ("Valerian Root" matches "valerian"). */
export function herbsMentioned(text: string, ingredients: Ingredient[]) {
  const haystack = text.toLowerCase();
  return ingredients.filter((ingredient) => {
    const key = ingredient.name.toLowerCase().replace(PLANT_PARTS, '').replace(/\s+/g, ' ').trim();
    return key.length >= 4 && new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(haystack);
  });
}
