// Lightweight natural-language matcher: maps free-text descriptions of how
// someone feels ("my tummy really aches") to known symptom slugs, without
// needing a server-side LLM call. Each phrase is a set of words that must
// ALL appear somewhere in the input (not necessarily adjacent), so typos or
// reordering in the surrounding words don't break the match.
const SYMPTOM_RULES: Record<string, string[][]> = {
  headache: [['head', 'ache'], ['head', 'pain'], ['head', 'hurt'], ['head', 'throb'], ['migraine']],
  insomnia: [
    ['cant', 'sleep'],
    ['trouble', 'sleep'],
    ['insomnia'],
    ['sleepless'],
    ['awake', 'night'],
    ['restless', 'night'],
  ],
  'digestive-issues': [
    ['tummy'],
    ['stomach'],
    ['belly'],
    ['gut'],
    ['bloat'],
    ['nausea'],
    ['indigestion'],
    ['diarrhea'],
    ['constipat'],
  ],
  'stress-anxiety': [
    ['stress'],
    ['stressed'],
    ['anxious'],
    ['anxiety'],
    ['racing', 'mind'],
    ['overwhelmed'],
    ['panic'],
    ['on', 'edge'],
    ['cant', 'relax'],
    ['worried'],
    ['nervous'],
  ],
  'low-energy': [['tired'], ['fatigue'], ['exhausted'], ['low', 'energy'], ['sluggish'], ['worn', 'out'], ['drained'], ['no', 'energy']],
  'joint-pain': [['joint'], ['knee', 'pain'], ['arthritis'], ['stiff', 'joint'], ['sore', 'joint'], ['ache', 'joint']],
  'cold-flu': [
    ['cold'],
    ['flu'],
    ['cough'],
    ['congest'],
    ['stuffy', 'nose'],
    ['sore', 'throat'],
    ['sneez'],
    ['runny', 'nose'],
    ['fever'],
    ['chills'],
  ],
  'skin-irritation': [['skin'], ['rash'], ['itchy'], ['acne'], ['blemish'], ['eczema'], ['irritated', 'skin']],
  'menstrual-discomfort': [['period'], ['menstrual'], ['cramps'], ['pms']],
  'immune-support': [['immune'], ['immunity'], ['run', 'down'], ['catching', 'colds'], ['getting', 'sick']],
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

const PROXIMITY_WINDOW = 4;

/** Index positions of every token that starts with `stem` (so "ache" also catches "aches"/"ached"). */
function indicesFor(tokens: string[], stem: string): number[] {
  const out: number[] = [];
  tokens.forEach((token, i) => {
    if (token.startsWith(stem)) out.push(i);
  });
  return out;
}

function phraseMatches(tokens: string[], words: string[]): boolean {
  const occurrences = words.map((word) => indicesFor(tokens, word));
  if (occurrences.some((idx) => idx.length === 0)) return false;
  if (words.length === 1) return true;

  // All words must have some occurrence within PROXIMITY_WINDOW of each other.
  for (const first of occurrences[0]) {
    if (occurrences.slice(1).every((idx) => idx.some((i) => Math.abs(i - first) <= PROXIMITY_WINDOW))) {
      return true;
    }
  }
  return false;
}

export interface SymptomMatch {
  slug: string;
  score: number;
}

/** Returns matched symptom slugs ranked by how many distinct phrases hit, best first. */
export function matchSymptomSlugs(text: string): SymptomMatch[] {
  const tokens = tokenize(text);
  const matches: SymptomMatch[] = [];

  for (const [slug, phrases] of Object.entries(SYMPTOM_RULES)) {
    let score = 0;
    for (const words of phrases) {
      if (phraseMatches(tokens, words)) score += 1;
    }
    if (score > 0) matches.push({ slug, score });
  }

  return matches.sort((a, b) => b.score - a.score);
}
