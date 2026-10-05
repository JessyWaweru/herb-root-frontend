// Mirrors apps.accounts.validators on the backend so the checklist never promises
// a password the server will then reject.
export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { id: 'case', label: 'Upper & lowercase letters', test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { id: 'number', label: 'A number', test: (p: string) => /\d/.test(p) },
  { id: 'symbol', label: 'A symbol (e.g. ! @ # &)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const;

export const meetsPasswordRules = (password: string) => PASSWORD_RULES.every((rule) => rule.test(password));
