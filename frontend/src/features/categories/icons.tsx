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
import i18n from "@/lib/i18n";
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

export function getIconLabel(iconName: IconName): string {
  return i18n.t(`categories:icons.${iconName}` as any);
}

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