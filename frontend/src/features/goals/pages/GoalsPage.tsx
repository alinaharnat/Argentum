import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Pencil,
  Ban,
  Target,
  Coins,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  useCreateGoal,
  useDeleteGoal,
  useGoals,
  useUpdateGoal,
} from "../hooks";
import {
  goalFormSchema,
  topUpSchema,
  type GoalFormData,
  type TopUpFormData,
} from "../schemas";
import { GoalStatus, type Goal } from "../types";
import {
  formatGoalDate,
  formatMoney,
  getDeadlineInfo,
  toDateInputValue,
} from "../utils";

export function GoalsPage() {
  const { t, i18n } = useTranslation("goals");
  const [tab, setTab] = useState<GoalStatus>(GoalStatus.Active);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [toppingUp, setToppingUp] = useState<Goal | null>(null);
  const [cancelling, setCancelling] = useState<Goal | null>(null);

  const { data, isLoading, isError, error } = useGoals();
  const remove = useDeleteGoal();

  const goals = useMemo(() => data?.data ?? [], [data]);

  const counts = useMemo(
    () => ({
      [GoalStatus.Active]: goals.filter((g) => g.status === GoalStatus.Active)
        .length,
      [GoalStatus.Completed]: goals.filter(
        (g) => g.status === GoalStatus.Completed,
      ).length,
      [GoalStatus.Cancelled]: goals.filter(
        (g) => g.status === GoalStatus.Cancelled,
      ).length,
    }),
    [goals],
  );

  const visibleGoals = useMemo(
    () => goals.filter((g) => g.status === tab),
    [goals, tab, i18n.language]
  );

  const tabsConfig = [
    { value: GoalStatus.Active, label: t("tabs.active") },
    { value: GoalStatus.Completed, label: t("tabs.completed") },
    { value: GoalStatus.Cancelled, label: t("tabs.cancelled") },
  ];

  const emptyTextMap: Record<GoalStatus, string> = {
    [GoalStatus.Active]: t("empty.active"),
    [GoalStatus.Completed]: t("empty.completed"),
    [GoalStatus.Cancelled]: t("empty.cancelled"),
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("newGoal")}
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 rounded-lg border bg-card p-1">
        {tabsConfig.map((tabItem) => (
          <button
            key={tabItem.value}
            type="button"
            onClick={() => setTab(tabItem.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              tab === tabItem.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent",
            )}
          >
            {tabItem.label}
            <span className="ml-1.5 opacity-70">{counts[tabItem.value]}</span>
          </button>
        ))}
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      )}
      {isError && (
        <p className="text-sm text-destructive">{getErrorMessage(error)}</p>
      )}

      {!isLoading && !isError && visibleGoals.length === 0 && (
        <Card>
          <CardContent className="flex h-48 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
            <Target className="h-10 w-10 opacity-40" />
            <p>{emptyTextMap[tab]}</p>
            {tab === GoalStatus.Active && (
              <Button variant="outline" onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("empty.createFirst")}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && visibleGoals.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleGoals.map((goal) => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onEdit={setEditing}
              onTopUp={setToppingUp}
              onCancel={setCancelling}
            />
          ))}
        </div>
      )}

      <GoalFormDialog
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
      />
      <GoalFormDialog
        open={editing !== null}
        mode="edit"
        initial={editing ?? undefined}
        onClose={() => setEditing(null)}
      />
      <TopUpDialog goal={toppingUp} onClose={() => setToppingUp(null)} />
      <CancelConfirmDialog
        goal={cancelling}
        loading={remove.isPending}
        error={remove.isError ? getErrorMessage(remove.error) : null}
        onCancel={() => {
          setCancelling(null);
          remove.reset();
        }}
        onConfirm={() => {
          if (!cancelling) return;
          remove.mutate(cancelling._id, {
            onSuccess: () => setCancelling(null),
          });
        }}
      />
    </div>
  );
}

const DEADLINE_TONE: Record<string, string> = {
  muted: "text-muted-foreground",
  warning: "text-amber-600",
  danger: "text-rose-600",
};

function GoalCard({
                    goal,
                    onEdit,
                    onTopUp,
                    onCancel,
                  }: {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onTopUp: (goal: Goal) => void;
  onCancel: (goal: Goal) => void;
}) {
  const { t } = useTranslation("goals");

  const statusVisuals: Record<
    GoalStatus,
    { iconBox: string; bar: string; badge: string; label: string }
    > = {
    [GoalStatus.Active]: {
      iconBox:
        "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300",
      bar: "bg-blue-500",
      badge:
        "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
      label: t("statusLabels.active"),
    },
    [GoalStatus.Completed]: {
      iconBox:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300",
      bar: "bg-emerald-500",
      badge:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
      label: t("statusLabels.completed"),
    },
    [GoalStatus.Cancelled]: {
      iconBox: "bg-muted text-muted-foreground",
      bar: "bg-muted-foreground/40",
      badge: "bg-muted text-muted-foreground",
      label: t("statusLabels.cancelled"),
    },
  };

  const visuals = statusVisuals[goal.status];
  const isActive = goal.status === GoalStatus.Active;
  const isCancelled = goal.status === GoalStatus.Cancelled;
  const achieved =
    goal.status === GoalStatus.Completed || goal.remainingAmount <= 0;

  const deadline =
    goal.targetDate && isActive ? getDeadlineInfo(goal.targetDate) : null;

  return (
    <Card
      className={cn("group relative flex flex-col", isCancelled && "opacity-70")}
    >
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
              visuals.iconBox,
            )}
          >
            <Target className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold">{goal.title}</div>
            <span
              className={cn(
                "mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                visuals.badge,
              )}
            >
              {visuals.label}
            </span>
          </div>
          {!isCancelled && (
            <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(goal)}
                aria-label={t("card.edit")}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCancel(goal)}
                aria-label={t("card.cancel")}
              >
                <Ban className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>

        {goal.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {goal.description}
          </p>
        )}

        <div className="mt-auto space-y-2">
          <div className="flex items-end justify-between gap-2">
            <span className="text-lg font-semibold">
              {formatMoney(goal.currentAmount, goal.currency)}
            </span>
            <span className="text-sm text-muted-foreground">
              {t("card.fromTarget", {
                target: formatMoney(goal.targetAmount, goal.currency),
              })}
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all", visuals.bar)}
              style={{ width: `${goal.progressPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">
              {t("card.accumulated", { percent: goal.progressPercentage })}
            </span>
            {achieved ? (
              <span className="flex items-center gap-1 font-medium text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t("card.achieved")}
              </span>
            ) : (
              <span className="text-muted-foreground">
                {t("card.remaining", {
                  amount: formatMoney(goal.remainingAmount, goal.currency),
                })}
              </span>
            )}
          </div>

          {deadline && (
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs",
                DEADLINE_TONE[deadline.tone],
              )}
            >
              <Calendar className="h-3.5 w-3.5" />
              {deadline.text}
            </div>
          )}
          {goal.targetDate && !isActive && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {t("card.until", { date: formatGoalDate(goal.targetDate) })}
            </div>
          )}
        </div>

        {isActive && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onTopUp(goal)}
          >
            <Coins className="mr-2 h-4 w-4" />
            {t("card.topUp")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function GoalFormDialog({
                          open,
                          mode,
                          initial,
                          onClose,
                        }: {
  open: boolean;
  mode: "create" | "edit";
  initial?: Goal;
  onClose: () => void;
}) {
  const { t } = useTranslation(["goals", "common"]);
  const create = useCreateGoal();
  const update = useUpdateGoal(initial?._id ?? "");
  const mutation = mode === "create" ? create : update;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    values: initial
      ? {
        title: initial.title,
        description: initial.description ?? "",
        targetAmount: String(initial.targetAmount),
        currentAmount: String(initial.currentAmount),
        currency: initial.currency,
        targetDate: toDateInputValue(initial.targetDate),
      }
      : undefined,
    defaultValues: {
      title: "",
      description: "",
      targetAmount: "",
      currentAmount: "",
      currency: "UAH",
      targetDate: "",
    },
  });

  const close = () => {
    onClose();
    mutation.reset();
    reset();
  };

  const onSubmit = (data: GoalFormData) => {
    const payload = {
      title: data.title.trim(),
      description: (data.description ?? "").trim(),
      targetAmount: Number(data.targetAmount),
      currentAmount: data.currentAmount ? Number(data.currentAmount) : 0,
      currency: data.currency.toUpperCase(),
      targetDate: data.targetDate || undefined,
    };

    mutation.mutate(payload, {
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
            {mode === "create"
              ? t("goals:modal.createTitle")
              : t("goals:modal.editTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("goals:modal.description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-title">{t("goals:modal.titleLabel")}</Label>
            <Input
              id="goal-title"
              placeholder={t("goals:modal.titlePlaceholder")}
              {...register("title")}
            />
            {errors.title?.message && (
              <p className="text-sm text-destructive">
                {t(`goals:${errors.title.message}` as any)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-description">
              {t("goals:modal.descriptionLabel")}
            </Label>
            <textarea
              id="goal-description"
              rows={3}
              placeholder={t("goals:modal.descriptionPlaceholder")}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register("description")}
            />
            {errors.description?.message && (
              <p className="text-sm text-destructive">
                {t(`goals:${errors.description.message}` as any)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="goal-target">
                {t("goals:modal.targetAmount")}
              </Label>
              <Input
                id="goal-target"
                inputMode="decimal"
                placeholder="50000"
                {...register("targetAmount")}
              />
              {errors.targetAmount?.message && (
                <p className="text-sm text-destructive">
                  {t(`goals:${errors.targetAmount.message}` as any)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-current">
                {t("goals:modal.currentAmount")}
              </Label>
              <Input
                id="goal-current"
                inputMode="decimal"
                placeholder="0"
                {...register("currentAmount")}
              />
              {errors.currentAmount?.message && (
                <p className="text-sm text-destructive">
                  {t(`goals:${errors.currentAmount.message}` as any)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="goal-currency">{t("goals:modal.currency")}</Label>
              <Input
                id="goal-currency"
                placeholder="UAH"
                maxLength={3}
                className="uppercase"
                {...register("currency")}
              />
              {errors.currency?.message && (
                <p className="text-sm text-destructive">
                  {t(`goals:${errors.currency.message}` as any)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-date">{t("goals:modal.targetDate")}</Label>
              <Input id="goal-date" type="date" {...register("targetDate")} />
            </div>
          </div>

          {mutation.isError && (
            <p className="text-sm text-destructive">
              {getErrorMessage(mutation.error)}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              {t("common:buttons.cancel")}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? t("goals:modal.submitting")
                : mode === "create"
                  ? t("goals:modal.createSubmit")
                  : t("goals:modal.editSubmit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TopUpDialog({
                       goal,
                       onClose,
                     }: {
  goal: Goal | null;
  onClose: () => void;
}) {
  const { t } = useTranslation(["goals", "common"]);
  const update = useUpdateGoal(goal?._id ?? "");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TopUpFormData>({
    resolver: zodResolver(topUpSchema),
    defaultValues: { amount: "" },
  });

  const close = () => {
    onClose();
    update.reset();
    reset();
  };

  const onSubmit = (data: TopUpFormData) => {
    if (!goal) return;
    update.mutate(
      { currentAmount: goal.currentAmount + Number(data.amount) },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={goal !== null} onOpenChange={(v) => !v && close()}>
      <DialogContent onClose={close}>
        <DialogHeader>
          <DialogTitle>{t("goals:topUpModal.title")}</DialogTitle>
          <DialogDescription>{goal?.title}</DialogDescription>
        </DialogHeader>
        {goal && (
          <p className="text-sm text-muted-foreground">
            {t("goals:topUpModal.description", {
              current: formatMoney(goal.currentAmount, goal.currency),
              target: formatMoney(goal.targetAmount, goal.currency),
              remaining: formatMoney(Math.max(goal.remainingAmount, 0), goal.currency),
            })}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topup-amount">
              {t("goals:topUpModal.amountLabel")}
            </Label>
            <Input
              id="topup-amount"
              inputMode="decimal"
              placeholder="1000"
              autoFocus
              {...register("amount")}
            />
            {errors.amount?.message && (
              <p className="text-sm text-destructive">
                {t(`goals:${errors.amount.message}` as any)}
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
              {t("common:buttons.cancel")}
            </Button>
            <Button type="submit" disabled={update.isPending}>
              {update.isPending
                ? t("goals:topUpModal.submitting")
                : t("goals:topUpModal.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CancelConfirmDialog({
                               goal,
                               loading,
                               error,
                               onCancel,
                               onConfirm,
                             }: {
  goal: Goal | null;
  loading: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useTranslation(["goals", "common"]);

  return (
    <Dialog open={goal !== null} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent onClose={onCancel}>
        <DialogHeader>
          <DialogTitle>{t("goals:cancelModal.title")}</DialogTitle>
          <DialogDescription>
            {t("goals:cancelModal.description", { title: goal?.title ?? "" })}
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {t("goals:cancelModal.back")}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading
              ? t("goals:cancelModal.submitting")
              : t("goals:cancelModal.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}