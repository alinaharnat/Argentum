import i18n from "@/lib/i18n";

function getLocale(): string {
  const lang = i18n.language || (typeof navigator !== "undefined" ? navigator.language : "uk");
  return lang.startsWith("en") ? "en-US" : "uk-UA";
}

export function formatMoney(amount: number, currency: string): string {
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

export function formatGoalDate(iso: string): string {
  try {
    const dateFormatter = new Intl.DateTimeFormat(getLocale(), {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return dateFormatter.format(new Date(iso));
  } catch {
    return iso;
  }
}

export function toDateInputValue(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
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

  if (diffDays < 0) {
    return { text: i18n.t("goals:deadline.expired"), tone: "danger" };
  }
  if (diffDays === 0) {
    return { text: i18n.t("goals:deadline.today"), tone: "warning" };
  }
  if (diffDays <= 7) {
    return {
      text: i18n.t("goals:deadline.daysLeft", { count: diffDays }),
      tone: "warning",
    };
  }
  return {
    text: i18n.t("goals:deadline.untilDate", {
      date: formatGoalDate(targetDate),
    }),
    tone: "muted",
  };
}