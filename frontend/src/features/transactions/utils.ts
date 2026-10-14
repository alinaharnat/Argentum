import i18n from "@/lib/i18n";

function getLocale(): string {
  const lang = i18n.language || (typeof navigator !== "undefined" ? navigator.language : "uk");
  return lang.startsWith("en") ? "en-US" : "uk-UA";
}

export function formatAmount(amount: number, currency: string): string {
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

export function formatTransactionDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const same = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (same(d, today)) return i18n.t("transactions:dateLabels.today", "Сьогодні");
  if (same(d, yesterday)) return i18n.t("transactions:dateLabels.yesterday", "Вчора");

  try {
    const dayFormatter = new Intl.DateTimeFormat(getLocale(), {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return dayFormatter.format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

export function toDateInputValue(iso?: string): string {
  if (!iso) return new Date().toISOString().slice(0, 10);
  return new Date(iso).toISOString().slice(0, 10);
}