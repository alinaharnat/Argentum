import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Pencil,
  Trash2,
  Filter,
  TrendingUp,
  TrendingDown,
  ArrowDownUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { useAccounts } from "@/features/accounts/hooks";
import { useCategories } from "@/features/categories/hooks";
import { CategoryIcon } from "@/features/categories/icons";
import { getCategoryDisplayName } from "@/features/categories/labels";
import { CategoryScope } from "@/features/categories/types";
import type { Account } from "@/features/accounts/types";
import type { Category } from "@/features/categories/types";
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction,
} from "../hooks";
import {
  transactionFormSchema,
  type TransactionFormData,
} from "../schemas";
import {
  SortOrder,
  TransactionSortField,
  TransactionType,
  type GetTransactionsQuery,
  type Transaction,
} from "../types";
import {
  formatAmount,
  formatTransactionDate,
  toDateInputValue,
} from "../utils";

const PAGE_SIZE = 50;

export function TransactionsPage() {
  const [filters, setFilters] = useState<GetTransactionsQuery>({
    sortBy: TransactionSortField.Date,
    sortOrder: SortOrder.Descending,
    limit: PAGE_SIZE,
    offset: 0,
  });
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);

  const { data, isLoading, isError, error } = useTransactions(filters);
  const accountsQuery = useAccounts();
  const categoriesQuery = useCategories();
  const remove = useDeleteTransaction();

  const accounts = accountsQuery.data?.data ?? [];
  const categories = categoriesQuery.data?.data ?? [];
  const transactions = data?.data ?? [];

  const accountById = useMemo(() => {
    return new Map(accounts.map((a) => [a._id, a]));
  }, [accounts]);
  const categoryById = useMemo(() => {
    return new Map(categories.map((c) => [c._id, c]));
  }, [categories]);

  const groups = useMemo(() => groupByDate(transactions), [transactions]);
  const canLoadMore = transactions.length === (filters.limit ?? PAGE_SIZE);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Транзакції</h2>
          <p className="text-muted-foreground">
            Усі ваші доходи та витрати з можливістю фільтрації
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          disabled={accounts.length === 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Нова транзакція
        </Button>
      </div>

      {accounts.length === 0 && !accountsQuery.isLoading && (
        <Card>
          <CardContent className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            Спочатку створіть рахунок на сторінці «Рахунки», щоб додавати
            транзакції.
          </CardContent>
        </Card>
      )}

      <FilterBar
        filters={filters}
        onChange={(next) => setFilters({ ...next, offset: 0 })}
        categories={categories}
      />

      {isLoading && (
        <p className="text-sm text-muted-foreground">Завантаження…</p>
      )}
      {isError && (
        <p className="text-sm text-destructive">{getErrorMessage(error)}</p>
      )}

      {!isLoading && transactions.length === 0 && (
        <Card>
          <CardContent className="flex h-40 items-center justify-center text-muted-foreground">
            Транзакцій не знайдено. Створіть першу або змініть фільтри.
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {groups.map(([dayLabel, items]) => (
          <section key={dayLabel} className="space-y-2">
            <h3 className="px-1 text-sm font-medium text-muted-foreground">
              {dayLabel}
            </h3>
            <div className="overflow-hidden rounded-lg border bg-card">
              {items.map((tx, idx) => (
                <TransactionRow
                  key={tx._id}
                  transaction={tx}
                  account={accountById.get(tx.accountId)}
                  category={categoryById.get(tx.categoryId)}
                  isLast={idx === items.length - 1}
                  onEdit={() => setEditing(tx)}
                  onDelete={() => setDeleting(tx)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {canLoadMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() =>
              setFilters((f) => ({
                ...f,
                limit: (f.limit ?? PAGE_SIZE) + PAGE_SIZE,
              }))
            }
          >
            Завантажити ще
          </Button>
        </div>
      )}

      <TransactionFormDialog
        open={createOpen}
        mode="create"
        accounts={accounts}
        categories={categories}
        onClose={() => setCreateOpen(false)}
      />
      <TransactionFormDialog
        open={editing !== null}
        mode="edit"
        initial={editing ?? undefined}
        accounts={accounts}
        categories={categories}
        onClose={() => setEditing(null)}
      />
      <DeleteConfirmDialog
        transaction={deleting}
        account={deleting ? accountById.get(deleting.accountId) : undefined}
        category={deleting ? categoryById.get(deleting.categoryId) : undefined}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (!deleting) return;
          remove.mutate(deleting._id, {
            onSuccess: () => setDeleting(null),
          });
        }}
        loading={remove.isPending}
        error={remove.isError ? getErrorMessage(remove.error) : null}
      />
    </div>
  );
}

function FilterBar({
  filters,
  onChange,
  categories,
}: {
  filters: GetTransactionsQuery;
  onChange: (next: GetTransactionsQuery) => void;
  categories: Category[];
}) {
  const reset = () =>
    onChange({
      sortBy: TransactionSortField.Date,
      sortOrder: SortOrder.Descending,
      limit: PAGE_SIZE,
      offset: 0,
    });

  const visibleCategories = filters.type
    ? categories.filter((c) => c.type === filters.type)
    : categories;

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Filter className="h-4 w-4" />
          Фільтри
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Тип</Label>
            <Select
              value={filters.type ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  type:
                    (e.target.value || undefined) as
                      | TransactionType
                      | undefined,
                  categoryId: undefined,
                })
              }
            >
              <option value="">Усі</option>
              <option value={TransactionType.Expense}>Витрати</option>
              <option value={TransactionType.Income}>Доходи</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Категорія</Label>
            <Select
              value={filters.categoryId ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  categoryId: e.target.value || undefined,
                })
              }
            >
              <option value="">Усі</option>
              {visibleCategories.map((c) => (
                <option key={c._id} value={c._id}>
                  {getCategoryDisplayName(c)}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Від (дата)</Label>
            <Input
              type="date"
              value={filters.dateFrom ?? ""}
              onChange={(e) =>
                onChange({ ...filters, dateFrom: e.target.value || undefined })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">До (дата)</Label>
            <Input
              type="date"
              value={filters.dateTo ?? ""}
              onChange={(e) =>
                onChange({ ...filters, dateTo: e.target.value || undefined })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Сума від</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0"
              value={filters.amountMin ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  amountMin:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Сума до</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="∞"
              value={filters.amountMax ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  amountMax:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Сортування</Label>
            <Select
              value={`${filters.sortBy ?? TransactionSortField.Date}:${filters.sortOrder ?? SortOrder.Descending}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split(":");
                onChange({
                  ...filters,
                  sortBy: sortBy as TransactionSortField,
                  sortOrder: Number(sortOrder) as SortOrder,
                });
              }}
            >
              <option value="date:-1">Дата (новіші)</option>
              <option value="date:1">Дата (старіші)</option>
              <option value="amount:-1">Сума (більші)</option>
              <option value="amount:1">Сума (менші)</option>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={reset}>
              <ArrowDownUp className="mr-2 h-4 w-4" />
              Скинути
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionRow({
  transaction,
  account,
  category,
  isLast,
  onEdit,
  onDelete,
}: {
  transaction: Transaction;
  account?: Account;
  category?: Category;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isIncome = transaction.type === TransactionType.Income;
  const sign = isIncome ? "+" : "−";
  const amountClass = isIncome ? "text-emerald-600" : "text-rose-600";
  const currency = account?.currency ?? "UAH";
  const categoryColor = category?.color ?? "#94a3b8";

  return (
    <div
      className={cn(
        "group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40",
        !isLast && "border-b",
      )}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: `${categoryColor}22` }}
      >
        {category ? (
          <CategoryIcon
            icon={category.icon}
            color={categoryColor}
            className="h-5 w-5"
          />
        ) : (
          <span className="text-xs text-muted-foreground">?</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate font-medium">
            {category
              ? getCategoryDisplayName(category)
              : "Невідома категорія"}
          </span>
          {transaction.description && (
            <span className="truncate text-sm text-muted-foreground">
              · {transaction.description}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{account?.name ?? "Невідомий рахунок"}</span>
        </div>
      </div>
      <div className={cn("text-right font-semibold tabular-nums", amountClass)}>
        {sign}
        {formatAmount(transaction.amount, currency).replace(/^[−-]/, "")}
      </div>
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function TransactionFormDialog({
  open,
  mode,
  initial,
  accounts,
  categories,
  onClose,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: Transaction;
  accounts: Account[];
  categories: Category[];
  onClose: () => void;
}) {
  const create = useCreateTransaction();
  const update = useUpdateTransaction(initial?._id ?? "");
  const mutation = mode === "create" ? create : update;

  const activeAccounts = accounts.filter((a) => a.isActive);

  const emptyDefaults: TransactionFormData = {
    accountId: "",
    categoryId: "",
    type: TransactionType.Expense,
    amount: "",
    date: toDateInputValue(),
    description: "",
  };

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    values: initial
      ? {
          accountId: initial.accountId,
          categoryId: initial.categoryId,
          type: initial.type,
          amount: String(initial.amount),
          date: toDateInputValue(initial.date),
          description: initial.description ?? "",
        }
      : undefined,
    defaultValues: emptyDefaults,
  });

  const watchedType = watch("type");
  const watchedCategoryId = watch("categoryId");
  const visibleCategories = categories.filter((c) => c.type === watchedType);

  const close = () => {
    onClose();
    mutation.reset();
    reset(emptyDefaults);
  };

  const onTypeChange = (next: TransactionType) => {
    setValue("type", next);
    const stillValid = visibleCategories.some(
      (c) => c._id === watchedCategoryId,
    );
    if (!stillValid) {
      const firstMatching = categories.find((c) => c.type === next);
      setValue("categoryId", firstMatching?._id ?? "");
    }
  };

  const onSubmit = (data: TransactionFormData) => {
    const [y, m, d] = data.date.split("-").map(Number);
    const localNoon = new Date(y, m - 1, d, 12, 0, 0);
    mutation.mutate(
      {
        accountId: data.accountId,
        categoryId: data.categoryId,
        type: data.type,
        amount: Number(data.amount),
        date: localNoon.toISOString(),
        description: data.description?.trim() || undefined,
      } as never,
      {
        onSuccess: () => {
          reset(emptyDefaults);
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && close()}>
      <DialogContent onClose={close} className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Нова транзакція" : "Редагування"}
          </DialogTitle>
          <DialogDescription>
            Введіть деталі операції — баланс рахунку оновиться автоматично
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2 rounded-md border p-1">
                <button
                  type="button"
                  onClick={() => onTypeChange(TransactionType.Expense)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors",
                    field.value === TransactionType.Expense
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                      : "text-muted-foreground hover:bg-accent",
                  )}
                >
                  <TrendingDown className="h-4 w-4" />
                  Витрата
                </button>
                <button
                  type="button"
                  onClick={() => onTypeChange(TransactionType.Income)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors",
                    field.value === TransactionType.Income
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "text-muted-foreground hover:bg-accent",
                  )}
                >
                  <TrendingUp className="h-4 w-4" />
                  Дохід
                </button>
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="tx-amount">Сума</Label>
              <Input
                id="tx-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register("amount")}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">
                  {errors.amount.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tx-date">Дата</Label>
              <Input id="tx-date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-sm text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-account">Рахунок</Label>
            <Controller
              control={control}
              name="accountId"
              render={({ field }) => (
                <Select id="tx-account" {...field}>
                  <option value="">— Оберіть —</option>
                  {activeAccounts.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name} ({a.currency})
                    </option>
                  ))}
                </Select>
              )}
            />
            {errors.accountId && (
              <p className="text-sm text-destructive">
                {errors.accountId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-category">Категорія</Label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select id="tx-category" {...field}>
                  <option value="">— Оберіть —</option>
                  {visibleCategories.length === 0 && (
                    <option value="" disabled>
                      Немає категорій для цього типу
                    </option>
                  )}
                  {visibleCategories
                    .filter((c) => c.scope === CategoryScope.System)
                    .map((c) => (
                      <option key={c._id} value={c._id}>
                        {getCategoryDisplayName(c)}
                      </option>
                    ))}
                  {visibleCategories
                    .filter((c) => c.scope === CategoryScope.User)
                    .map((c) => (
                      <option key={c._id} value={c._id}>
                        {getCategoryDisplayName(c)}
                      </option>
                    ))}
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="text-sm text-destructive">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-desc">Опис (необовʼязково)</Label>
            <Input
              id="tx-desc"
              placeholder="Покупка в АТБ"
              maxLength={200}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {mutation.isError && (
            <p className="text-sm text-destructive">
              {getErrorMessage(mutation.error)}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              Скасувати
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? "Збереження…"
                : mode === "create"
                  ? "Створити"
                  : "Зберегти"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteConfirmDialog({
  transaction,
  account,
  category,
  onCancel,
  onConfirm,
  loading,
  error,
}: {
  transaction: Transaction | null;
  account?: Account;
  category?: Category;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
  error: string | null;
}) {
  const currency = account?.currency ?? "UAH";
  return (
    <Dialog open={transaction !== null} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent onClose={onCancel}>
        <DialogHeader>
          <DialogTitle>Видалити транзакцію?</DialogTitle>
          <DialogDescription>
            {transaction
              ? `${category ? getCategoryDisplayName(category) : "Транзакція"} · ${formatAmount(transaction.amount, currency)} — буде видалено, баланс рахунку відкоригується.`
              : ""}
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Скасувати
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Видалення…" : "Видалити"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function groupByDate(transactions: Transaction[]): [string, Transaction[]][] {
  const map = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const key = formatTransactionDate(tx.date);
    const arr = map.get(key);
    if (arr) {
      arr.push(tx);
    } else {
      map.set(key, [tx]);
    }
  }
  return Array.from(map.entries());
}
