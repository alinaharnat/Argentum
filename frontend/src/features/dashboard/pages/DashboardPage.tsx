import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DashboardPage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Дашборд</h2>
        <p className="text-muted-foreground">Огляд ваших фінансів</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Баланс</CardDescription>
            <CardTitle className="text-3xl">₴0.00</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Загальний залишок</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Доходи (місяць)</CardDescription>
            <CardTitle className="text-3xl text-emerald-600">₴0.00</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">За поточний місяць</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Витрати (місяць)</CardDescription>
            <CardTitle className="text-3xl text-rose-600">₴0.00</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">За поточний місяць</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Прогрес цілей</CardDescription>
            <CardTitle className="text-3xl">0%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Накопичено від цілей</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Графік витрат</CardTitle>
          <CardDescription>
            Додайте транзакції, щоб побачити статистику
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-72 items-center justify-center text-muted-foreground">
          Дані з’являться тут
        </CardContent>
      </Card>
    </div>
  );
}
