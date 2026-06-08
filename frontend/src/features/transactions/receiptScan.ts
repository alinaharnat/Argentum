import type { IconName } from "@/features/categories/types";
import { toDateInputValue } from "./utils";

export interface ScannedReceiptItem {
  name: string;
  price: number;
}

export interface ScannedReceipt {
  merchant: string;
  /** yyyy-mm-dd, ready for a date input */
  date: string;
  amount: number;
  items: ScannedReceiptItem[];
  /** Suggested category icon to match against existing categories */
  suggestedIcon: IconName;
}

interface ReceiptTemplate {
  merchant: string;
  icon: IconName;
  catalog: { name: string; min: number; max: number }[];
}

const TEMPLATES: ReceiptTemplate[] = [
  {
    merchant: "АТБ-Маркет",
    icon: "food",
    catalog: [
      { name: "Хліб «Київський»", min: 18, max: 32 },
      { name: "Молоко 2.5%", min: 32, max: 45 },
      { name: "Яйця С1, 10 шт", min: 48, max: 72 },
      { name: "Сир «Голландський»", min: 95, max: 160 },
      { name: "Куряче філе, кг", min: 110, max: 180 },
      { name: "Банани, кг", min: 38, max: 55 },
      { name: "Вода негазована 1.5л", min: 14, max: 24 },
    ],
  },
  {
    merchant: "Сільпо",
    icon: "food",
    catalog: [
      { name: "Йогурт «Активіа»", min: 28, max: 42 },
      { name: "Кава мелена 250г", min: 145, max: 240 },
      { name: "Печиво вівсяне", min: 32, max: 58 },
      { name: "Помідори, кг", min: 55, max: 95 },
      { name: "Олія соняшникова 1л", min: 65, max: 98 },
      { name: "Сік апельсиновий 1л", min: 42, max: 66 },
    ],
  },
  {
    merchant: "АЗК WOG",
    icon: "car",
    catalog: [
      { name: "Пальне A-95, л", min: 52, max: 62 },
      { name: "Кава з собою", min: 35, max: 55 },
      { name: "Омивач скла", min: 110, max: 180 },
    ],
  },
  {
    merchant: "Аптека «Подорожник»",
    icon: "pharmacy",
    catalog: [
      { name: "Парацетамол 500мг", min: 28, max: 55 },
      { name: "Вітамін C", min: 75, max: 140 },
      { name: "Пластир, набір", min: 32, max: 60 },
      { name: "Маска медична, 5 шт", min: 20, max: 45 },
    ],
  },
  {
    merchant: "McDonald's",
    icon: "cafe",
    catalog: [
      { name: "Біг Мак", min: 95, max: 125 },
      { name: "Картопля фрі", min: 45, max: 70 },
      { name: "Кока-Кола 0.5", min: 35, max: 55 },
      { name: "Морозиво", min: 25, max: 40 },
    ],
  },
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Simulates OCR analysis of a receipt photo.
 * In a real implementation this would call a backend OCR/LLM endpoint;
 * here we generate a plausible receipt to demonstrate the flow end-to-end.
 */
export function analyzeReceipt(): ScannedReceipt {
  const template = pick(TEMPLATES);

  const itemCount = randomInt(2, Math.min(5, template.catalog.length));
  const shuffled = [...template.catalog].sort(() => Math.random() - 0.5);
  const chosen = shuffled.slice(0, itemCount);

  const items: ScannedReceiptItem[] = chosen.map((c) => ({
    name: c.name,
    price: round2(randomInt(c.min, c.max) + randomInt(0, 99) / 100),
  }));

  const amount = round2(items.reduce((sum, i) => sum + i.price, 0));

  return {
    merchant: template.merchant,
    date: toDateInputValue(),
    amount,
    items,
    suggestedIcon: template.icon,
  };
}
