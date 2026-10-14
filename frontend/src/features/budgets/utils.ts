import i18n from "@/lib/i18n";

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

function getLocale(): string {
  const lang = i18n.language || (typeof navigator !== "undefined" ? navigator.language : "uk");
  return lang.startsWith("en") ? "en-US" : "uk-UA";
}

export function formatPeriod(period: string): string {
  const [year, month] = period.split("-").map(Number);
  try {
    const formatter = new Intl.DateTimeFormat(getLocale(), {
      month: "long",
      year: "numeric",
    });
    const text = formatter.format(new Date(year, month - 1, 1));
    return text.charAt(0).toUpperCase() + text.slice(1);
  } catch {
    return period;
  }
}

export function formatAmount(amount: number, currency = "UAH"): string {
  try {
    return new Intl.NumberFormat(getLocale(), {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}