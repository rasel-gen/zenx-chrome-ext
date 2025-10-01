/**
 * Fiat currencies config
 *
 * Usage:
 * - Import { FIAT_CURRENCIES, FIAT_META, FIAT_SYMBOLS } to drive dropdowns and formatting
 * - `FIAT_CURRENCIES` is an ordered list of supported codes
 * - `FIAT_META[code]` returns label and icon path (icon may be missing)
 * - `FIAT_SYMBOLS[code]` returns display currency symbol
 */

import aedIcon from 'data-base64:@assets/public/aed.png'
import bdtIcon from 'data-base64:@assets/public/bdt.png'
import cnyIcon from 'data-base64:@assets/public/cny.png'
import eurIcon from 'data-base64:@assets/public/eur.png'
import gbpIcon from 'data-base64:@assets/public/gbp.png'
import pkrIcon from 'data-base64:@assets/public/pkr.png'
import rubIcon from 'data-base64:@assets/public/rub.png'
import usdIcon from 'data-base64:@assets/public/usd.png'

export const FIAT_CURRENCIES: string[] = [
  'USD', // United States Dollar
  'AED', // UAE dirham
  'INR', // Indian rupee
  'BDT', // Bangladeshi taka
  'PKR', // Pakistani rupee
  'RUB', // Russian ruble
]

export const FIAT_META: Record<string, { label: string; icon?: string }> = {
  USD: { label: 'United States Dollar', icon: usdIcon },
  EUR: { label: 'Euro', icon: eurIcon },
  GBP: { label: 'Pound sterling', icon: gbpIcon },
  JPY: { label: 'Japanese yen' },
  CNY: { label: 'Chinese yuan renminbi', icon: cnyIcon },
  INR: { label: 'Indian rupee' },
  BDT: { label: 'Bangladeshi taka', icon: bdtIcon },
  PKR: { label: 'Pakistani rupee', icon: pkrIcon },
  AUD: { label: 'Australian dollar' },
  CAD: { label: 'Canadian dollar' },
  CHF: { label: 'Swiss franc' },
  HKD: { label: 'Hong Kong dollar' },
  SGD: { label: 'Singapore dollar' },
  SEK: { label: 'Swedish krona' },
  NZD: { label: 'New Zealand dollar' },
  KRW: { label: 'South Korean won' },
  TRY: { label: 'Turkish lira' },
  RUB: { label: 'Russian ruble', icon: rubIcon },
  BRL: { label: 'Brazilian real' },
  ZAR: { label: 'South African rand' },
  MXN: { label: 'Mexican peso' },
  AED: { label: 'United Arab Emirates dirham', icon: aedIcon },
}

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
}

export function getFiatIconOrFallback(code: string): {
  type: 'icon' | 'initials'
  value: string
} {
  const meta = FIAT_META[code]
  if (meta?.icon) return { type: 'icon', value: meta.icon }
  const letters = (code || '').toUpperCase().slice(0, 2)
  return { type: 'initials', value: letters }
}
