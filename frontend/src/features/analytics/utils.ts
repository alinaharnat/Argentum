import i18n from "@/lib/i18n";

export function getCurrentPeriod(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

function getLocale(): string {
  const lang = i18n.language || (typeof navigator !== "undefined" ? navigator.language : "uk");
  return lang.startsWith("en") ? "en-US" : "uk-UA";
}

export function formatMoney(amount: number, currency = "UAH"): string {
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

export function formatCompact(amount: number): string {
  try {
    return new Intl.NumberFormat(getLocale(), {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  } catch {
    return String(amount);
  }
}

export function formatPeriodLabel(period: string): string {
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

export function getShortMonths(): string[] {
  const lang = i18n.language || (typeof navigator !== "undefined" ? navigator.language : "uk");
  const locale = lang.startsWith("en") ? "en-US" : "uk-UA";

  const formatter = new Intl.DateTimeFormat(locale, { month: "short" });

  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2026, i, 1);
    const text = formatter.format(date);
    return text.charAt(0).toUpperCase() + text.slice(1);
  });
}