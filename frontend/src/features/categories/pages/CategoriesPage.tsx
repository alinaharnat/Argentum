import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Lock,
  TrendingDown,
  TrendingUp,
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
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../hooks";
import { categoryFormSchema, type CategoryFormData } from "../schemas";
import {
  CategoryScope,
  CategoryType,
  IconName,
  type Category,
  type GetCategoriesQuery,
} from "../types";
import { CategoryIcon, allIcons, iconLabels } from "../icons";
import {
  getCategoryDisplayName,
  categoryTypePluralLabels,
} from "../labels";

const COLOR_PRESETS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#ec4899",
  "#64748b",
];

export function CategoriesPage() {
  const [filters, setFilters] = useState<GetCategoriesQuery>({
    scope: CategoryScope.All,
  });
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const queryFilters: GetCategoriesQuery = {
    ...filters,
    name: search.trim() || undefined,
  };

  const { data, isLoading, isError, error } = useCategories(queryFilters);
  const remove = useDeleteCategory();

  const categories = data?.data ?? [];

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Категорії</h2>
          <p className="text-muted-foreground">
            Системні категорії доступні всім, власні — можна редагувати та
            видаляти
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Нова категорія
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-56 flex-1">
          <Label className="mb-1.5 block text-xs text-muted-foreground">
            Пошук
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Назва категорії"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="w-44">
          <Label className="mb-1.5 block text-xs text-muted-foreground">
            Тип
          </Label>
          <Select
            value={filters.type ?? ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                type:
                  (e.target.value || undefined) as CategoryType | undefined,
              }))
            }
          >
            <option value="">Усі типи</option>
            <option value={CategoryType.Expense}>Витрати</option>
            <option value={CategoryType.Income}>Доходи</option>
          </Select>
        </div>
        <div className="w-44">
          <Label className="mb-1.5 block text-xs text-muted-foreground">
            Походження
          </Label>
          <Select
            value={filters.scope ?? CategoryScope.All}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                scope: e.target.value as CategoryScope,
              }))
            }
          >
            <option value={CategoryScope.All}>Усі</option>
            <option value={CategoryScope.User}>Власні</option>
            <option value={CategoryScope.System}>Системні</option>
          </Select>
        </div>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Завантаження…</p>
      )}
      {isError && (
        <p className="text-sm text-destructive">{getErrorMessage(error)}</p>
      )}

      {!isLoading && categories.length === 0 && (
        <Card>
          <CardContent className="flex h-40 items-center justify-center text-muted-foreground">
            Категорій не знайдено.
          </CardContent>
        </Card>
      )}

      {!isLoading && categories.length > 0 && (
        <div className="space-y-6">
          <CategorySection
            kind={CategoryType.Expense}
            categories={categories.filter(
              (c) => c.type === CategoryType.Expense,
            )}
            onEdit={setEditing}
            onDelete={setDeleting}
          />
          <CategorySection
            kind={CategoryType.Income}
            categories={categories.filter(
              (c) => c.type === CategoryType.Income,
            )}
            onEdit={setEditing}
            onDelete={setDeleting}
          />
        </div>
      )}

      <CategoryFormDialog
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
      />
      <CategoryFormDialog
        open={editing !== null}
        mode="edit"
        initial={editing ?? undefined}
        onClose={() => setEditing(null)}
      />
      <DeleteConfirmDialog
        category={deleting}
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

function CategorySection({
  kind,
  categories,
  onEdit,
  onDelete,
}: {
  kind: CategoryType;
  categories: Category[];
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
}) {
  if (categories.length === 0) return null;

  const isExpense = kind === CategoryType.Expense;
  const Icon = isExpense ? TrendingDown : TrendingUp;
  const accentClass = isExpense
    ? "border-rose-200 bg-rose-50/50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300"
    : "border-emerald-200 bg-emerald-50/50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300";
  const stripeClass = isExpense ? "bg-rose-500" : "bg-emerald-500";

  return (
    <section className="space-y-3">
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border px-4 py-2",
          accentClass,
        )}
      >
        <div className="flex items-center gap-2 font-semibold">
          <Icon className="h-4 w-4" />
          {categoryTypePluralLabels[kind]}
        </div>
        <span className="text-sm opacity-70">{categories.length}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((cat) => (
          <CategoryItem
            key={cat._id}
            category={cat}
            stripeClass={stripeClass}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}

function CategoryItem({
  category,
  stripeClass,
  onEdit,
  onDelete,
}: {
  category: Category;
  stripeClass: string;
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
}) {
  const isSystem = category.scope === CategoryScope.System;
  return (
    <div className="group relative flex items-center gap-3 overflow-hidden rounded-lg border bg-card p-3 transition-colors hover:bg-accent/40">
      <span
        className={cn("absolute inset-y-0 left-0 w-1", stripeClass)}
        aria-hidden
      />
      <div
        className="ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: `${category.color}22` }}
      >
        <CategoryIcon
          icon={category.icon}
          color={category.color}
          className="h-5 w-5"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 truncate font-medium">
          {getCategoryDisplayName(category)}
          {isSystem && <Lock className="h-3 w-3 text-muted-foreground" />}
        </div>
        <div className="text-xs text-muted-foreground">
          {isSystem ? "Системна" : "Власна"}
        </div>
      </div>
      {!isSystem && (
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(category)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(category)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

function CategoryFormDialog({
  open,
  mode,
  initial,
  onClose,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: Category;
  onClose: () => void;
}) {
  const create = useCreateCategory();
  const update = useUpdateCategory(initial?._id ?? "");
  const mutation = mode === "create" ? create : update;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    values: initial
      ? {
          name: initial.name,
          type: initial.type,
          icon: initial.icon,
          color: initial.color,
        }
      : undefined,
    defaultValues: {
      name: "",
      type: CategoryType.Expense,
      icon: IconName.Folder,
      color: COLOR_PRESETS[0],
    },
  });

  const close = () => {
    onClose();
    mutation.reset();
    reset();
  };

  const onSubmit = (data: CategoryFormData) => {
    mutation.mutate(data as never, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && close()}>
      <DialogContent onClose={close} className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Нова категорія" : "Редагування категорії"}
          </DialogTitle>
          <DialogDescription>
            Оберіть назву, тип, іконку та колір
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Назва</Label>
              <Input
                id="cat-name"
                placeholder="Продукти"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-type">Тип</Label>
              <Select id="cat-type" {...register("type")}>
                <option value={CategoryType.Expense}>Витрата</option>
                <option value={CategoryType.Income}>Дохід</option>
              </Select>
            </div>
          </div>

          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Іконка</Label>
                <div className="grid max-h-48 grid-cols-7 gap-1.5 overflow-y-auto rounded-md border p-2">
                  {allIcons.map((iconName) => {
                    const isSelected = field.value === iconName;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => field.onChange(iconName)}
                        title={iconLabels[iconName]}
                        className={cn(
                          "flex h-9 items-center justify-center rounded-md border transition-colors",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-transparent hover:bg-accent",
                        )}
                      >
                        <CategoryIcon icon={iconName} className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          />

          <Controller
            control={control}
            name="color"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Колір</Label>
                <div className="flex flex-wrap items-center gap-2">
                  {COLOR_PRESETS.map((color) => {
                    const isSelected =
                      field.value.toLowerCase() === color.toLowerCase();
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => field.onChange(color)}
                        className={cn(
                          "h-8 w-8 rounded-md border-2 transition-transform hover:scale-110",
                          isSelected
                            ? "border-foreground"
                            : "border-transparent",
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={color}
                      />
                    );
                  })}
                  <Input
                    type="color"
                    className="h-8 w-12 cursor-pointer p-0.5"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </div>
                {errors.color && (
                  <p className="text-sm text-destructive">
                    {errors.color.message}
                  </p>
                )}
              </div>
            )}
          />

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
  category,
  onCancel,
  onConfirm,
  loading,
  error,
}: {
  category: Category | null;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <Dialog open={category !== null} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent onClose={onCancel}>
        <DialogHeader>
          <DialogTitle>Видалити категорію?</DialogTitle>
          <DialogDescription>
            Категорія «{category ? getCategoryDisplayName(category) : ""}»
            буде видалена. Дію не можна скасувати.
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
