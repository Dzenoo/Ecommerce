const CURRENCY_MAP: Record<string, { symbol: string; position: 'before' | 'after' }> = {
  USD: { symbol: '$', position: 'before' },
  EUR: { symbol: '€', position: 'after' },
  GBP: { symbol: '£', position: 'before' },
  RSD: { symbol: 'RSD', position: 'after' },
  BAM: { symbol: 'KM', position: 'after' },
  HRK: { symbol: 'kn', position: 'after' },
  TRY: { symbol: '₺', position: 'after' },
  CHF: { symbol: 'CHF', position: 'before' },
  PLN: { symbol: 'zł', position: 'after' },
  CZK: { symbol: 'Kč', position: 'after' },
  HUF: { symbol: 'Ft', position: 'after' },
  RON: { symbol: 'lei', position: 'after' },
  BGN: { symbol: 'лв', position: 'after' },
};

function getCurrencyConfig() {
  const code = process.env.NEXT_PUBLIC_CURRENCY || 'USD';
  return CURRENCY_MAP[code] || { symbol: code, position: 'after' };
}

export function formatPrice(price: number): string {
  const { symbol, position } = getCurrencyConfig();
  const formatted = price.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return position === 'before'
    ? `${symbol}${formatted}`
    : `${formatted} ${symbol}`;
}
