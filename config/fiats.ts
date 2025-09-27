/**
 * Fiat currencies config
 *
 * Usage:
 * - Import { FIAT_CURRENCIES, FIAT_META, FIAT_SYMBOLS } to drive dropdowns and formatting
 * - `FIAT_CURRENCIES` is an ordered list of supported codes
 * - `FIAT_META[code]` returns label and icon path (icon may be missing)
 * - `FIAT_SYMBOLS[code]` returns display currency symbol
 */

export const FIAT_CURRENCIES: string[] = [
  'USD', // United States Dollar
  'AED', // UAE dirham
  'INR', // Indian rupee
  'BDT', // Bangladeshi taka
  'PKR', // Pakistani rupee
  'RUB', // Russian ruble
];

export const FIAT_META: Record<string, { label: string; icon?: string }> = {
  USD: { label: 'United States Dollar', icon: '/usd.png' },
  EUR: { label: 'Euro', icon: '/eur.png' },
  GBP: { label: 'Pound sterling', icon: '/gbp.png' },
  JPY: { label: 'Japanese yen' },
  CNY: { label: 'Chinese yuan renminbi', icon: '/cny.png' },
  INR: { label: 'Indian rupee' },
  BDT: { label: 'Bangladeshi taka', icon: '/bdt.png' },
  PKR: { label: 'Pakistani rupee', icon: '/pkr.png' },
  AUD: { label: 'Australian dollar' },
  CAD: { label: 'Canadian dollar' },
  CHF: { label: 'Swiss franc' },
  HKD: { label: 'Hong Kong dollar' },
  SGD: { label: 'Singapore dollar' },
  SEK: { label: 'Swedish krona' },
  NZD: { label: 'New Zealand dollar' },
  KRW: { label: 'South Korean won' },
  TRY: { label: 'Turkish lira' },
  RUB: { label: 'Russian ruble', icon: '/rub.png' },
  BRL: { label: 'Brazilian real' },
  ZAR: { label: 'South African rand' },
  MXN: { label: 'Mexican peso' },
  AED: { label: 'United Arab Emirates dirham', icon: '/aed.png' },
};

export const FIAT_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  BDT: '৳',
  PKR: '₨',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  HKD: 'HK$',
  SGD: 'S$',
  SEK: 'kr',
  NZD: 'NZ$',
  KRW: '₩',
  TRY: '₺',
  RUB: '₽',
  BRL: 'R$',
  ZAR: 'R',
  MXN: 'MX$',
  AED: 'AED',
};

export function getFiatIconOrFallback(code: string): { type: 'icon' | 'initials'; value: string } {
  const meta = FIAT_META[code];
  if (meta?.icon) return { type: 'icon', value: meta.icon };
  const letters = (code || '').toUpperCase().slice(0, 2);
  return { type: 'initials', value: letters };
}


