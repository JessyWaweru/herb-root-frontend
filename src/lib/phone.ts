// Mirrors normalize_phone in apps.accounts.validators: Kenyan numbers in any common
// format, or any other country's number written with its + code.
export const PHONE_HELP = 'Enter a valid phone number, e.g. 0712 345 678';

export function isValidPhone(value: string) {
  const digits = value.replace(/[\s\-().]/g, '');
  return /^(?:\+?254|0)?[17]\d{8}$/.test(digits) || /^\+[1-9]\d{7,14}$/.test(digits);
}
