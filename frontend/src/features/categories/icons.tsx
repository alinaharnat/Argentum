import {
  Folder,
  Box,
  Home,
  Lightbulb,
  Car,
  Bus,
  Utensils,
  Coffee,
  ShoppingCart,
  Film,
  Palette,
  Heart,
  Pill,
  GraduationCap,
  Plane,
  Dumbbell,
  Sparkles,
  PawPrint,
  RotateCw,
  Wallet,
  Banknote,
  Gift,
  TrendingUp,
  Star,
  Undo2,
  HandHeart,
  Users,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import { IconName } from "./types";

export const iconMap: Record<IconName, LucideIcon> = {
  [IconName.Folder]: Folder,
  [IconName.Other]: Box,
  [IconName.Home]: Home,
  [IconName.Utilities]: Lightbulb,
  [IconName.Car]: Car,
  [IconName.Transport]: Bus,
  [IconName.Food]: Utensils,
  [IconName.Cafe]: Coffee,
  [IconName.Shopping]: ShoppingCart,
  [IconName.Entertainment]: Film,
  [IconName.Hobbies]: Palette,
  [IconName.Health]: Heart,
  [IconName.Pharmacy]: Pill,
  [IconName.Education]: GraduationCap,
  [IconName.Travel]: Plane,
  [IconName.Sport]: Dumbbell,
  [IconName.Beauty]: Sparkles,
  [IconName.Pets]: PawPrint,
  [IconName.Subscriptions]: RotateCw,
  [IconName.Wallet]: Wallet,
  [IconName.Salary]: Banknote,
  [IconName.Gift]: Gift,
  [IconName.Investment]: TrendingUp,
  [IconName.Bonus]: Star,
  [IconName.Refund]: Undo2,
  [IconName.Charity]: HandHeart,
  [IconName.Family]: Users,
  [IconName.Work]: Briefcase,
};

export const iconLabels: Record<IconName, string> = {
  [IconName.Folder]: "Папка",
  [IconName.Other]: "Інше",
  [IconName.Home]: "Дім",
  [IconName.Utilities]: "Комунальні",
  [IconName.Car]: "Авто",
  [IconName.Transport]: "Транспорт",
  [IconName.Food]: "Їжа",
  [IconName.Cafe]: "Кафе",
  [IconName.Shopping]: "Покупки",
  [IconName.Entertainment]: "Розваги",
  [IconName.Hobbies]: "Хобі",
  [IconName.Health]: "Здоровʼя",
  [IconName.Pharmacy]: "Аптека",
  [IconName.Education]: "Освіта",
  [IconName.Travel]: "Подорожі",
  [IconName.Sport]: "Спорт",
  [IconName.Beauty]: "Краса",
  [IconName.Pets]: "Тварини",
  [IconName.Subscriptions]: "Підписки",
  [IconName.Wallet]: "Гаманець",
  [IconName.Salary]: "Зарплата",
  [IconName.Gift]: "Подарунок",
  [IconName.Investment]: "Інвестиції",
  [IconName.Bonus]: "Бонус",
  [IconName.Refund]: "Повернення",
  [IconName.Charity]: "Благодійність",
  [IconName.Family]: "Сімʼя",
  [IconName.Work]: "Робота",
};

export const allIcons = Object.values(IconName) as IconName[];

export function CategoryIcon({
  icon,
  color,
  className = "h-4 w-4",
}: {
  icon: IconName;
  color?: string;
  className?: string;
}) {
  const Icon = iconMap[icon] ?? Folder;
  return <Icon className={className} style={color ? { color } : undefined} />;
}
