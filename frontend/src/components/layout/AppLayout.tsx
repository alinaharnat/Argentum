import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Target,
  Tags,
  CreditCard,
  LogOut,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useLogout } from "@/features/auth/hooks";

const navItemsConfig = [
  { to: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { to: "/accounts", labelKey: "nav.accounts", icon: CreditCard },
  { to: "/transactions", labelKey: "nav.transactions", icon: Receipt },
  { to: "/categories", labelKey: "nav.categories", icon: Tags },
  { to: "/budgets", labelKey: "nav.budgets", icon: Wallet },
  { to: "/goals", labelKey: "nav.goals", icon: Target },
];

export function AppLayout() {
  const { t, i18n } = useTranslation();
  const logout = useLogout();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  const toggleLanguage = () => {
    const nextLang = i18n.language?.startsWith("uk") ? "en" : "uk";
    i18n.changeLanguage(nextLang);
  };

  const navItems = (
    <nav className="flex-1 space-y-1 p-3">
      {navItemsConfig.map(({ to, labelKey, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )
          }
        >
          <Icon className="h-4 w-4" />
          {t(labelKey as any)}
        </NavLink>
      ))}
    </nav>
  );

  const bottomActions = (
    <div className="space-y-1 border-t p-3">
      <Button
        variant="ghost"
        className="w-full justify-start text-muted-foreground"
        onClick={toggleLanguage}
      >
        <Globe className="mr-2 h-4 w-4" />
        {t("nav.language")}
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start text-muted-foreground hover:text-destructive"
        onClick={() => logout.mutate()}
      >
        <LogOut className="mr-2 h-4 w-4" />
        {t("nav.logout")}
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar для десктопу (зафіксований на всю висоту екрана) */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-card md:flex">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Logo className="h-7 w-7" />
          <h1 className="text-xl font-bold tracking-tight">Argentum</h1>
        </div>
        {navItems}
        {bottomActions}
      </aside>

      {/* Мобільна шапка */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b bg-card px-4 md:hidden">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <h1 className="text-lg font-bold tracking-tight">Argentum</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("nav.openMenu")}
          onClick={() => setDrawerOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      {/* Мобільне висувне меню */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r bg-card shadow-lg">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <Logo className="h-6 w-6" />
                <h1 className="text-lg font-bold tracking-tight">Argentum</h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("nav.closeMenu")}
                onClick={() => setDrawerOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {navItems}
            {bottomActions}
          </aside>
        </div>
      )}

      {/* Основний контент */}
      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}