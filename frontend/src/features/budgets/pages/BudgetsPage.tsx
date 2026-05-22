import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Wallet,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/axios";
import { useCategories } from "@/features/categories/hooks";
import {
  CategoryScope,
  CategoryType,
  type Category,
} from "@/features/categories/types";
import { CategoryIcon } from "@/features/categories/icons";
import { getCategoryDisplayName } from "@/features/categories/labels";
import { useBudgetStatus, useCreateBudget, useUpdateBudget } from "../hooks";
import {
  budgetCreateSchema,
  budgetEditSchema,
  type BudgetCreateFormData,
  type BudgetEditFormData,
} from "../schemas";
import type { BudgetStatus } from "../types";
import { formatAmount, formatPeriod, getCurrentPeriod, shiftPeriod } from "../utils";

export function BudgetsPage() {
  const [period, setPeriod] = useState(getCurrentPeriod());
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<BudgetStatus | null>(null);

  const { data, isLoading, isError, error } = useBudgetStatus({ period });
  const categoriesQuery = useCategories({
    type: CategoryType.Expense,
    scope: CategoryScope.All,
  });

  const budgets = useMemo(() => data?.data ?? [], [data]);
  const categories = useMemo(
    () => categoriesQuery.data?.data ?? [],
    [categoriesQuery.data],
  );

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c._id, c])),
    [categories],
  );

  const budgetedIds = useMemo(
    () => new Set(budgets.map((b) => b.categoryId)),
    [budgets],
  );
  const availableCategories = categories.filter((c) => !budgetedIds.has(c._id));

  const totals = budgets.reduce(
    (acc, b) => ({
      limit: acc.limit + b.amountLimit,
      spent: acc.spent + b.spent,
      remaining: acc.remaining + b.remaining,
    }),
    { limit: 0, spent: 0, remaining: 0 },
  );

  const isCurrent = period === getCurrentPeriod();
  const exceededCount = budgets.filter((b) => b.isExceeded).length;

  const categoryName = (id: string): string => {
    const category = categoryMap.get(id);
    return category ? getCategoryDisplayName(category) : "Категорія";
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Бюджети</h2>
          <p className="text-muted-foreground">
            Місячні ліміти витрат за категоріями
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Новий бюджет
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-md border bg-card p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setPeriod((p) => shiftPeriod(p, -1))}
            aria-label="Попередній місяць"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="flex min-w-40 items-center justify-center gap-2 text-sm font-medium">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            {formatPeriod(period)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setPeriod((p) => shiftPeriod(p, 1))}
            aria-label="Наступний місяць"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        {!isCurrent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPeriod(getCurrentPeriod())}
          >
            Поточний місяць
          </Button>
        )}
        {exceededCount > 0 && (
          <span className="flex items-center gap-1.5 rounded-md bg-rose-50 px-2.5 py-1 text-sm font-medium text-rose-600 dark:bg-rose-950/30">
            <AlertTriangle className="h-3.5 w-3.5" />
            Перевищено: {exceededCount}
          </span>
        )}
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Завантаження…</p>
      )}
      {isError && (
        <p className="text-sm text-destructive">{getErrorMessage(error)}</p>
      )}

      {!isLoading && !isError && budgets.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Загальний ліміт"
              value={formatAmount(totals.limit)}
            />
            <StatCard
              label="Витрачено"
              value={formatAmount(totals.spent)}
              valueClass="text-rose-600"
            />
            <StatCard
              label="Залишок"
              value={formatAmount(totals.remaining)}
              valueClass={
                totals.remaining < 0 ? "text-rose-600" : "text-emerald-600"
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.budgetId}
                status={budget}
                category={categoryMap.get(budget.categoryId)}
                onEdit={setEditing}
              />
            ))}
          </div>
        </>
      )}

      {!isLoading && !isError && budgets.length === 0 && (
        <Card>
          <CardContent className="flex h-48 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
            <Wallet className="h-10 w-10 opacity-40" />
            <p>На {formatPeriod(period).toLowerCase()} бюджетів ще немає.</p>
            <Button variant="outline" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Створити перший бюджет
            </Button>
          </CardContent>
        </Card>
      )}

      <CreateBudgetDialog
        open={createOpen}
        period={period}
        availableCategories={availableCategories}
        categoriesLoading={categoriesQuery.isLoading}
        onClose={() => setCreateOpen(false)}
      />
      <EditBudgetDialog
        status={editing}
        categoryName={editing ? categoryName(editing.categoryId) : ""}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className={cn("text-2xl", valueClass)}>{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function BudgetCard({
  status,
  category,
  onEdit,
}: {
  status: BudgetStatus;
  category?: Category;
  onEdit: (status: BudgetStatus) => void;
}) {
  const percent =
    status.amountLimit > 0 ? (status.spent / status.amountLimit) * 100 : 0;
  const level = status.isExceeded
    ? "exceeded"
    : percent >= 80
      ? "warning"
      : "ok";
  const barClass = {
    ok: "bg-emerald-500",
    warning: "bg-amber-500",
    exceeded: "bg-rose-500",
  }[level];

  return (
    <Card className="group relative">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
            style={{
              backgroundColor: category ? `${category.color}22` : undefined,
            }}
          >
            {category ? (
              <CategoryIcon
                icon={category.icon}
                color={category.color}
                className="h-5 w-5"
              />
            ) : (
              <Wallet className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium">
              {category ? getCategoryDisplayName(category) : "Категорія"}
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.round(percent)}% використано
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => onEdit(status)}
            aria-label="Редагувати бюджет"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", barClass)}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{formatAmount(status.spent)}</span>
          <span className="text-muted-foreground">
            з {formatAmount(status.amountLimit)}
          </span>
        </div>

        {status.isExceeded ? (
          <div className="flex items-center gap-1.5 text-sm font-medium text-rose-600">
            <AlertTriangle className="h-3.5 w-3.5" />
            Перевищено на {formatAmount(Math.abs(status.remaining))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Залишок:{" "}
            <span className="font-medium text-emerald-600">
              {formatAmount(status.remaining)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CreateBudgetDialog({
  open,
  period,
  availableCategories,
  categoriesLoading,
  onClose,
}: {
  open: boolean;
  period: string;
  availableCategories: Category[];
  categoriesLoading: boolean;
  onClose: () => void;
}) {
  const create = useCreateBudget();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetCreateFormData>({
    resolver: zodResolver(budgetCreateSchema),
    defaultValues: { categoryId: "", amountLimit: "" },
  });

  const close = () => {
    onClose();
    create.reset();
    reset();
  };

  const onSubmit = (formData: BudgetCreateFormData) => {
    create.mutate(
      {
        categoryId: formData.categoryId,
        amountLimit: Number(formData.amountLimit),
        period,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  const noCategories = !categoriesLoading && availableCategories.length === 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && close()}>
      <DialogContent onClose={close}>
        <DialogHeader>
          <DialogTitle>Новий бюджет</DialogTitle>
          <DialogDescription>
            Ліміт витрат на {formatPeriod(period)}
          </DialogDescription>
        </DialogHeader>

        {noCategories ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Для всіх категорій витрат на цей місяць уже встановлено бюджети.
              Створіть нову категорію витрат або оберіть інший місяць.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={close}>
                Закрити
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget-category">Категорія витрат</Label>
              <Select
                id="budget-category"
                disabled={categoriesLoading}
                {...register("categoryId")}
              >
                <option value="">
                  {categoriesLoading ? "Завантаження…" : "Оберіть категорію"}
                </option>
                {availableCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {getCategoryDisplayName(category)}
                  </option>
                ))}
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget-amount">Ліміт, ₴</Label>
              <Input
                id="budget-amount"
                inputMode="decimal"
                placeholder="5000"
                {...register("amountLimit")}
              />
              {errors.amountLimit && (
                <p className="text-sm text-destructive">
                  {errors.amountLimit.message}
                </p>
              )}
            </div>

            {create.isError && (
              <p className="text-sm text-destructive">
                {getErrorMessage(create.error)}
              </p>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={close}>
                Скасувати
              </Button>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? "Збереження…" : "Створити"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditBudgetDialog({
  status,
  categoryName,
  onClose,
}: {
  status: BudgetStatus | null;
  categoryName: string;
  onClose: () => void;
}) {
  const update = useUpdateBudget(status?.budgetId ?? "");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetEditFormData>({
    resolver: zodResolver(budgetEditSchema),
    values: status ? { amountLimit: String(status.amountLimit) } : undefined,
    defaultValues: { amountLimit: "" },
  });

  const close = () => {
    onClose();
    update.reset();
    reset();
  };

  const onSubmit = (formData: BudgetEditFormData) => {
    update.mutate(
      { amountLimit: Number(formData.amountLimit) },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={status !== null} onOpenChange={(v) => !v && close()}>
      <DialogContent onClose={close}>
        <DialogHeader>
          <DialogTitle>Редагування бюджету</DialogTitle>
          <DialogDescription>
            {categoryName}
            {status ? ` · ${formatPeriod(status.period)}` : ""}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {status && (
            <p className="text-sm text-muted-foreground">
              Уже витрачено:{" "}
              <span className="font-medium text-foreground">
                {formatAmount(status.spent)}
              </span>
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="edit-budget-amount">Ліміт, ₴</Label>
            <Input
              id="edit-budget-amount"
              inputMode="decimal"
              placeholder="5000"
              {...register("amountLimit")}
            />
            {errors.amountLimit && (
              <p className="text-sm text-destructive">
                {errors.amountLimit.message}
              </p>
            )}
          </div>
          {update.isError && (
            <p className="text-sm text-destructive">
              {getErrorMessage(update.error)}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              Скасувати
            </Button>
            <Button type="submit" disabled={update.isPending}>
              {update.isPending ? "Збереження…" : "Зберегти"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
