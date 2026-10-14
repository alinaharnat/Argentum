import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Receipt,
  Wallet,
  Target,
  Tags,
  CreditCard,
  BarChart3,
  Lock,
  ArrowRight,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { isAuthenticated } from "@/features/auth/token";

const featureKeys = [
  { icon: CreditCard, key: "accounts" },
  { icon: Receipt, key: "transactions" },
  { icon: Tags, key: "categories" },
  { icon: Wallet, key: "budgets" },
  { icon: Target, key: "goals" },
  { icon: BarChart3, key: "analytics" },
] as const;

export function LandingPage() {
  const { t } = useTranslation("landing");
  const authed = isAuthenticated();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="flex h-16 items-center justify-between border-b bg-card px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Logo className="h-7 w-7" />
          <h1 className="text-xl font-bold tracking-tight">Argentum</h1>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {authed ? (
            <Link to="/dashboard" className={cn(buttonVariants())}>
              {t("header.toDashboard")}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                {t("header.login")}
              </Link>
              <Link to="/register" className={cn(buttonVariants())}>
                {t("header.register")}
              </Link>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-8 sm:py-28">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("hero.title")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {t("hero.description")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {authed ? (
              <Link
                to="/dashboard"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                {t("hero.goToDashboard")}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  {t("hero.startFree")}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
                <Link
                  to="/login"
                  className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
                >
                  {t("hero.alreadyHaveAccount")}
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureKeys.map(({ icon: Icon, key }) => (
              <Card key={key}>
                <CardContent className="space-y-3 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{t(`features.${key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`features.${key}.description`)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Registration notice */}
        {!authed && (
          <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-8">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Lock className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{t("notice.title")}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("notice.description")}
                  </p>
                </div>
                <Link
                  to="/register"
                  className={cn(buttonVariants(), "shrink-0")}
                >
                  {t("notice.createAccount")}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      <footer className="border-t bg-card py-6 text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <Logo className="h-5 w-5" />
          <span>© {new Date().getFullYear()} Argentum</span>
        </div>
      </footer>
    </div>
  );
}