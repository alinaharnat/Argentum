import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Target,
  Tags,
  CreditCard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks";

const nav = [
  { to: "/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { to: "/accounts", label: "Рахунки", icon: CreditCard },
  { to: "/transactions", label: "Транзакції", icon: Receipt },
  { to: "/categories", label: "Категорії", icon: Tags },
  { to: "/budgets", label: "Бюджети", icon: Wallet },
  { to: "/goals", label: "Цілі", icon: Target },
];

export function AppLayout() {
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

  const navItems = (
    <nav className="flex-1 space-y-1 p-3">
      {nav.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  const logoutButton = (
    <div className="border-t p-3">
      <Button
        variant="ghost"
        className="w-full justify-start text-muted-foreground"
        onClick={() => logout.mutate()}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Вийти
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-60 flex-col border-r bg-card md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold tracking-tight">Argentum</h1>
        </div>
        {navItems}
        {logoutButton}
      </aside>

      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b bg-card px-4 md:hidden">
        <h1 className="text-lg font-bold tracking-tight">Argentum</h1>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Відкрити меню"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r bg-card shadow-lg">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <h1 className="text-lg font-bold tracking-tight">Argentum</h1>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Закрити меню"
                onClick={() => setDrawerOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {navItems}
            {logoutButton}
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
