export function formatMoney(amount: number, currency: string): string {
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

const dateFormatter = new Intl.DateTimeFormat("uk-UA", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatGoalDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function toDateInputValue(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

function pluralDays(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "дні";
  return "днів";
}

export type DeadlineTone = "muted" | "warning" | "danger";

export interface DeadlineInfo {
  text: string;
  tone: DeadlineTone;
}

export function getDeadlineInfo(targetDate: string): DeadlineInfo {
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / 86_400_000,
  );

  if (diffDays < 0) return { text: "Дедлайн минув", tone: "danger" };
  if (diffDays === 0) return { text: "Дедлайн сьогодні", tone: "warning" };
  if (diffDays <= 7) {
    return {
      text: `Залишилось ${diffDays} ${pluralDays(diffDays)}`,
      tone: "warning",
    };
  }
  return { text: `до ${formatGoalDate(targetDate)}`, tone: "muted" };
}
