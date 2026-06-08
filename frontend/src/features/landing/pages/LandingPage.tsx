import { Link } from "react-router-dom";
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
import { cn } from "@/lib/utils";
import { isAuthenticated } from "@/features/auth/token";

const features = [
  {
    icon: CreditCard,
    title: "Рахунки",
    description:
      "Керуйте всіма своїми рахунками в одному місці — від готівки до карток.",
  },
  {
    icon: Receipt,
    title: "Транзакції",
    description:
      "Фіксуйте доходи та витрати з фільтрами, сортуванням і категоріями.",
  },
  {
    icon: Tags,
    title: "Категорії",
    description:
      "Гнучкі категорії з іконками, щоб бачити, на що насправді йдуть гроші.",
  },
  {
    icon: Wallet,
    title: "Бюджети",
    description:
      "Встановлюйте ліміти на категорії та контролюйте витрати протягом місяця.",
  },
  {
    icon: Target,
    title: "Цілі",
    description:
      "Накопичуйте на мрії та відстежуйте прогрес до кожної фінансової цілі.",
  },
  {
    icon: BarChart3,
    title: "Аналітика",
    description:
      "Наочні графіки доходів, витрат і динаміки за місяцями та категоріями.",
  },
];

export function LandingPage() {
  const authed = isAuthenticated();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="flex h-16 items-center justify-between border-b bg-card px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Logo className="h-7 w-7" />
          <h1 className="text-xl font-bold tracking-tight">Argentum</h1>
        </div>
        <div className="flex items-center gap-2">
          {authed ? (
            <Link to="/dashboard" className={cn(buttonVariants())}>
              До дашборду
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                Увійти
              </Link>
              <Link to="/register" className={cn(buttonVariants())}>
                Зареєструватись
              </Link>
            </>
          )}
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-8 sm:py-28">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Ваші фінанси під контролем
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Argentum — це особистий фінансовий помічник: рахунки, транзакції,
            бюджети, цілі та аналітика в одному застосунку. Плануйте, відстежуйте
            та досягайте своїх фінансових цілей.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {authed ? (
              <Link
                to="/dashboard"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Перейти до дашборду
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  Почати безкоштовно
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
                >
                  У мене вже є акаунт
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardContent className="space-y-3 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
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
                  <h3 className="text-lg font-semibold">Потрібна реєстрація</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Перегляд дашборду, рахунків, транзакцій, бюджетів, цілей та
                    аналітики доступний лише зареєстрованим користувачам. Створіть
                    безкоштовний акаунт, щоб почати керувати своїми фінансами.
                  </p>
                </div>
                <Link
                  to="/register"
                  className={cn(buttonVariants(), "shrink-0")}
                >
                  Створити акаунт
                  <ArrowRight className="h-4 w-4" />
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
