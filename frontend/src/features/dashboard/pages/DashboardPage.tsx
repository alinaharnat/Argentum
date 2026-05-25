import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Target,
  ArrowRight,
  Receipt,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/axios";
import { useAccounts } from "@/features/accounts/hooks";
import { useCategories } from "@/features/categories/hooks";
import { CategoryScope } from "@/features/categories/types";
import { CategoryIcon } from "@/features/categories/icons";
import { getCategoryDisplayName } from "@/features/categories/labels";
import { useGoals } from "@/features/goals/hooks";
import { GoalStatus } from "@/features/goals/types";
import { useTransactions } from "@/features/transactions/hooks";
import {
  TransactionSortField,
  TransactionType,
  SortOrder,
} from "@/features/transactions/types";
import { formatTransactionDate } from "@/features/transactions/utils";
import {
  useExpensesByCategory,
  useMonthlyStats,
  useSummary,
} from "@/features/analytics/hooks";
import {
  MONTH_SHORT,
  formatCompact,
  formatMoney,
  formatPeriodLabel,
  getCurrentPeriod,
  getCurrentYear,
} from "@/features/analytics/utils";

const FALLBACK_COLOR = "#94a3b8";

export function DashboardPage() {
  const period = getCurrentPeriod();
  const year = getCurrentYear();

  const accountsQuery = useAccounts({ isActive: true });
  const summaryQuery = useSummary(period);
  const expensesQuery = useExpensesByCategory(period);
  const monthlyQuery = useMonthlyStats(year);
  const goalsQuery = useGoals();
  const categoriesQuery = useCategories({ scope: CategoryScope.All });
  const transactionsQuery = useTransactions({
    limit: 5,
    sortBy: TransactionSortField.Date,
    sortOrder: SortOrder.Descending,
  });

  const categories = useMemo(
    () => categoriesQuery.data?.data ?? [],
    [categoriesQuery.data],
  );
  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c._id, c])),
    [categories],
  );

  const accounts = accountsQuery.data?.data ?? [];
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const summary = summaryQuery.data;

  const goals = goalsQuery.data?.data ?? [];
  const activeGoals = goals.filter((g) => g.status === GoalStatus.Active);
  const goalsTarget = activeGoals.reduce((s, g) => s + g.targetAmount, 0);
  const goalsCurrent = activeGoals.reduce((s, g) => s + g.currentAmount, 0);
  const goalsProgress =
    goalsTarget > 0
      ? Math.min(100, Math.round((goalsCurrent / goalsTarget) * 100))
      : null;

  const expenseChartData = useMemo(
    () =>
      (expensesQuery.data?.data ?? [])
        .map((item) => {
          const category = categoryMap.get(item.categoryId);
          return {
            categoryId: item.categoryId,
            name: category
              ? getCategoryDisplayName(category)
              : (item.categoryName ?? "Інше"),
            total: item.total,
            fill: category?.color ?? FALLBACK_COLOR,
          };
        })
        .sort((a, b) => b.total - a.total),
    [expensesQuery.data, categoryMap],
  );
  const expensesTotal = expenseChartData.reduce((s, e) => s + e.total, 0);

  const monthlyData = useMemo(() => {
    const byMonth = new Map(
      (monthlyQuery.data?.data ?? []).map((m) => [m.month, m]),
    );
    return MONTH_SHORT.map((label, index) => {
      const stat = byMonth.get(index + 1);
      return {
        label,
        income: stat?.income ?? 0,
        expense: stat?.expense ?? 0,
      };
    });
  }, [monthlyQuery.data]);
  const monthlyHasData = monthlyData.some(
    (m) => m.income > 0 || m.expense > 0,
  );

  const transactions = transactionsQuery.data?.data ?? [];

  return (
    <div className="space-y-6 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Дашборд</h2>
        <p className="text-muted-foreground">
          Огляд ваших фінансів за {formatPeriodLabel(period)}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Загальний баланс"
          icon={Wallet}
          value={
            accountsQuery.isLoading ? "…" : formatMoney(totalBalance)
          }
          hint={`${accounts.length} активних рахунків`}
        />
        <StatCard
          label="Доходи (місяць)"
          icon={TrendingUp}
          value={summaryQuery.isLoading ? "…" : formatMoney(summary?.totalIncome ?? 0)}
          valueClass="text-emerald-600"
          hint={formatPeriodLabel(period)}
        />
        <StatCard
          label="Витрати (місяць)"
          icon={TrendingDown}
          value={
            summaryQuery.isLoading
              ? "…"
              : formatMoney(summary?.totalExpenses ?? 0)
          }
          valueClass="text-rose-600"
          hint={formatPeriodLabel(period)}
        />
        <StatCard
          label="Прогрес цілей"
          icon={Target}
          value={
            goalsQuery.isLoading
              ? "…"
              : goalsProgress === null
                ? "—"
                : `${goalsProgress}%`
          }
          hint={
            activeGoals.length > 0
              ? `${activeGoals.length} активних цілей`
              : "Немає активних цілей"
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Витрати за категоріями</CardTitle>
            <CardDescription>{formatPeriodLabel(period)}</CardDescription>
          </CardHeader>
          <CardContent>
            {expensesQuery.isLoading && <ChartSkeleton />}
            {expensesQuery.isError && (
              <ChartError message={getErrorMessage(expensesQuery.error)} />
            )}
            {!expensesQuery.isLoading &&
              !expensesQuery.isError &&
              expenseChartData.length === 0 && (
                <ChartEmpty message="За цей місяць витрат ще немає" />
              )}
            {!expensesQuery.isLoading &&
              !expensesQuery.isError &&
              expenseChartData.length > 0 && (
                <div className="space-y-4">
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={expenseChartData}
                          dataKey="total"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={2}
                        />
                        <Tooltip
                          formatter={(value) => formatMoney(Number(value))}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        Усього
                      </span>
                      <span className="text-lg font-semibold">
                        {formatMoney(expensesTotal)}
                      </span>
                    </div>
                  </div>
                  <div className="max-h-44 space-y-1.5 overflow-y-auto">
                    {expenseChartData.map((entry) => (
                      <div
                        key={entry.categoryId}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span
                          className="h-3 w-3 shrink-0 rounded-sm"
                          style={{ backgroundColor: entry.fill }}
                        />
                        <span className="min-w-0 flex-1 truncate">
                          {entry.name}
                        </span>
                        <span className="text-muted-foreground">
                          {expensesTotal > 0
                            ? Math.round((entry.total / expensesTotal) * 100)
                            : 0}
                          %
                        </span>
                        <span className="w-28 text-right font-medium">
                          {formatMoney(entry.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Доходи та витрати</CardTitle>
            <CardDescription>За {year} рік</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyQuery.isLoading && <ChartSkeleton />}
            {monthlyQuery.isError && (
              <ChartError message={getErrorMessage(monthlyQuery.error)} />
            )}
            {!monthlyQuery.isLoading && !monthlyQuery.isError && (
              <>
                {!monthlyHasData && (
                  <ChartEmpty message="За цей рік даних ще немає" />
                )}
                {monthlyHasData && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData} margin={{ left: 4, right: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        width={48}
                        tickFormatter={formatCompact}
                      />
                      <Tooltip
                        formatter={(value) => formatMoney(Number(value))}
                        cursor={{ fill: "rgba(0,0,0,0.04)" }}
                      />
                      <Legend />
                      <Bar
                        dataKey="income"
                        name="Доходи"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="expense"
                        name="Витрати"
                        fill="#f43f5e"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div className="space-y-1.5">
              <CardTitle>Останні транзакції</CardTitle>
              <CardDescription>Нещодавні операції</CardDescription>
            </div>
            <SectionLink to="/transactions" />
          </CardHeader>
          <CardContent>
            {transactionsQuery.isLoading && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Завантаження…
              </p>
            )}
            {transactionsQuery.isError && (
              <p className="py-8 text-center text-sm text-destructive">
                {getErrorMessage(transactionsQuery.error)}
              </p>
            )}
            {!transactionsQuery.isLoading &&
              !transactionsQuery.isError &&
              transactions.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
                  <Receipt className="h-8 w-8 opacity-40" />
                  <p className="text-sm">Транзакцій ще немає</p>
                </div>
              )}
            {!transactionsQuery.isLoading && transactions.length > 0 && (
              <div className="space-y-1">
                {transactions.map((transaction) => {
                  const category = categoryMap.get(transaction.categoryId);
                  const isIncome =
                    transaction.type === TransactionType.Income;
                  return (
                    <div
                      key={transaction._id}
                      className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-accent/40"
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                        style={{
                          backgroundColor: category
                            ? `${category.color}22`
                            : undefined,
                        }}
                      >
                        {category ? (
                          <CategoryIcon
                            icon={category.icon}
                            color={category.color}
                            className="h-4 w-4"
                          />
                        ) : (
                          <Receipt className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">
                          {category
                            ? getCategoryDisplayName(category)
                            : "Без категорії"}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {transaction.description ||
                            formatTransactionDate(transaction.date)}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "shrink-0 text-sm font-semibold",
                          isIncome ? "text-emerald-600" : "text-rose-600",
                        )}
                      >
                        {isIncome ? "+" : "−"}
                        {formatMoney(transaction.amount)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div className="space-y-1.5">
              <CardTitle>Активні цілі</CardTitle>
              <CardDescription>Прогрес накопичення</CardDescription>
            </div>
            <SectionLink to="/goals" />
          </CardHeader>
          <CardContent>
            {goalsQuery.isLoading && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Завантаження…
              </p>
            )}
            {goalsQuery.isError && (
              <p className="py-8 text-center text-sm text-destructive">
                {getErrorMessage(goalsQuery.error)}
              </p>
            )}
            {!goalsQuery.isLoading &&
              !goalsQuery.isError &&
              activeGoals.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
                  <Target className="h-8 w-8 opacity-40" />
                  <p className="text-sm">Активних цілей немає</p>
                </div>
              )}
            {!goalsQuery.isLoading && activeGoals.length > 0 && (
              <div className="space-y-4">
                {activeGoals.slice(0, 4).map((goal) => (
                  <div key={goal._id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="min-w-0 truncate font-medium">
                        {goal.title}
                      </span>
                      <span className="shrink-0 text-muted-foreground">
                        {formatMoney(goal.currentAmount, goal.currency)} /{" "}
                        {formatMoney(goal.targetAmount, goal.currency)}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${goal.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  valueClass,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  valueClass?: string;
  icon: typeof Wallet;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription>{label}</CardDescription>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardTitle className={cn("text-2xl", valueClass)}>{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function SectionLink({ to }: { to: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      Усі
      <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}

function ChartSkeleton() {
  return (
    <div className="flex h-60 items-center justify-center text-sm text-muted-foreground">
      Завантаження…
    </div>
  );
}

function ChartError({ message }: { message: string }) {
  return (
    <div className="flex h-60 items-center justify-center text-sm text-destructive">
      {message}
    </div>
  );
}

function ChartEmpty({ message }: { message: string }) {
  return (
    <div className="flex h-60 items-center justify-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
