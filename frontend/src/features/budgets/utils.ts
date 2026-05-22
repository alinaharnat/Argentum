export function getCurrentPeriod(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

export function shiftPeriod(period: string, delta: number): string {
  const [year, month] = period.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  const shiftedMonth = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${date.getFullYear()}-${shiftedMonth}`;
}

const monthYearFormatter = new Intl.DateTimeFormat("uk-UA", {
  month: "long",
  year: "numeric",
});

export function formatPeriod(period: string): string {
  const [year, month] = period.split("-").map(Number);
  const text = monthYearFormatter.format(new Date(year, month - 1, 1));
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatAmount(amount: number): string {
  try {
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: "UAH",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ₴`;
  }
}
