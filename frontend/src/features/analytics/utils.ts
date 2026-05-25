export function getCurrentPeriod(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function formatMoney(amount: number, currency = "UAH"): string {
  try {
    return new Intl.NumberFormat("uk-UA", {
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
    return new Intl.NumberFormat("uk-UA", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  } catch {
    return String(amount);
  }
}

const periodFormatter = new Intl.DateTimeFormat("uk-UA", {
  month: "long",
  year: "numeric",
});

export function formatPeriodLabel(period: string): string {
  const [year, month] = period.split("-").map(Number);
  const text = periodFormatter.format(new Date(year, month - 1, 1));
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const MONTH_SHORT = [
  "Січ",
  "Лют",
  "Бер",
  "Кві",
  "Тра",
  "Чер",
  "Лип",
  "Сер",
  "Вер",
  "Жов",
  "Лис",
  "Гру",
];
