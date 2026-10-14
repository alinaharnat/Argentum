import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Pencil,
  Power,
  PowerOff,
  Wallet,
  Banknote,
  PiggyBank,
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
import { formatMoney } from "@/features/analytics/utils";
import {
  useAccounts,
  useActivateAccount,
  useCreateAccount,
  useDeactivateAccount,
  useEditAccount,
} from "../hooks";
import {
  createAccountSchema,
  editAccountSchema,
  type CreateAccountFormData,
  type EditAccountFormData,
} from "../schemas";
import { AccountType, type Account, type GetAccountsQuery } from "../types";

const typeIcons: Record<AccountType, typeof Wallet> = {
  [AccountType.Cash]: Wallet,
  [AccountType.Bank]: Banknote,
  [AccountType.Savings]: PiggyBank,
};

export function AccountsPage() {
  const { t } = useTranslation("accounts");
  const [filters, setFilters] = useState<GetAccountsQuery>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);

  const { data, isLoading, isError, error } = useAccounts(filters);
  const activate = useActivateAccount();
  const deactivate = useDeactivateAccount();

  const accounts = data?.data ?? [];

  const typeLabels: Record<AccountType, string> = {
    [AccountType.Cash]: t("types.cash"),
    [AccountType.Bank]: t("types.bank"),
    [AccountType.Savings]: t("types.savings"),
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("addAccount")}
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="w-44">
          <Label className="mb-1.5 block text-xs text-muted-foreground">
            {t("filters.type")}
          </Label>
          <Select
            value={filters.type ?? ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                type: (e.target.value || undefined) as AccountType | undefined,
              }))
            }
          >
            <option value="">{t("filters.allTypes")}</option>
            <option value={AccountType.Cash}>{t("types.cash")}</option>
            <option value={AccountType.Bank}>{t("types.bank")}</option>
            <option value={AccountType.Savings}>{t("types.savings")}</option>
          </Select>
        </div>
        <div className="w-44">
          <Label className="mb-1.5 block text-xs text-muted-foreground">
            {t("filters.status")}
          </Label>
          <Select
            value={
              filters.isActive === undefined ? "" : String(filters.isActive)
            }
            onChange={(e) => {
              const v = e.target.value;
              setFilters((f) => ({
                ...f,
                isActive: v === "" ? undefined : v === "true",
              }));
            }}
          >
            <option value="">{t("filters.allStatuses")}</option>
            <option value="true">{t("filters.active")}</option>
            <option value="false">{t("filters.archive")}</option>
          </Select>
        </div>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      )}
      {isError && (
        <p className="text-sm text-destructive">{getErrorMessage(error)}</p>
      )}

      {!isLoading && accounts.length === 0 && (
        <Card>
          <CardContent className="flex h-40 items-center justify-center text-muted-foreground">
            {t("empty")}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((acc) => {
          const Icon = typeIcons[acc.type];
          return (
            <Card
              key={acc._id}
              className={cn(!acc.isActive && "opacity-60")}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardDescription className="flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5" />
                      {typeLabels[acc.type]}
                      {!acc.isActive && (
                        <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase">
                          {t("statusBadge.archived")}
                        </span>
                      )}
                    </CardDescription>
                    <CardTitle className="text-xl">{acc.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold">
                  {formatMoney(acc.balance, acc.currency)}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(acc)}
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    {t("actions.edit")}
                  </Button>
                  {acc.isActive ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={deactivate.isPending}
                      onClick={() => deactivate.mutate(acc._id)}
                    >
                      <PowerOff className="mr-1.5 h-3.5 w-3.5" />
                      {t("actions.toArchive")}
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={activate.isPending}
                      onClick={() => activate.mutate(acc._id)}
                    >
                      <Power className="mr-1.5 h-3.5 w-3.5" />
                      {t("actions.activate")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <CreateAccountDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
      <EditAccountDialog
        account={editing}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}

function CreateAccountDialog({
                               open,
                               onOpenChange,
                             }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation(["accounts", "common"]);
  const create = useCreateAccount();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { type: AccountType.Cash, currency: "UAH" },
  });

  const onSubmit = (data: CreateAccountFormData) => {
    const payload = {
      name: data.name,
      type: data.type,
      balance:
        data.balance && data.balance.trim() !== ""
          ? Number(data.balance)
          : undefined,
      currency:
        data.currency && data.currency.trim() !== ""
          ? data.currency.toUpperCase()
          : undefined,
    };
    create.mutate(payload, {
      onSuccess: () => {
        reset({ type: AccountType.Cash, currency: "UAH" });
        onOpenChange(false);
      },
    });
  };

  const close = () => {
    onOpenChange(false);
    create.reset();
    reset({ type: AccountType.Cash, currency: "UAH" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={close}>
        <DialogHeader>
          <DialogTitle>{t("accounts:createModal.title")}</DialogTitle>
          <DialogDescription>
            {t("accounts:createModal.description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("accounts:createModal.title")}</Label>
            <Input
              id="name"
              placeholder={t("accounts:createModal.namePlaceholder")}
              {...register("name")}
            />
            {errors.name?.message && (
              <p className="text-sm text-destructive">
                {t(`accounts:${errors.name.message}` as any)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">{t("accounts:filters.type")}</Label>
            <Select id="type" {...register("type")}>
              <option value={AccountType.Cash}>{t("accounts:types.cash")}</option>
              <option value={AccountType.Bank}>{t("accounts:types.bank")}</option>
              <option value={AccountType.Savings}>{t("accounts:types.savings")}</option>
            </Select>
            {errors.type?.message && (
              <p className="text-sm text-destructive">
                {t(`accounts:${errors.type.message}` as any)}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="balance">
                {t("accounts:createModal.initialBalance")}
              </Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("balance")}
              />
              {errors.balance?.message && (
                <p className="text-sm text-destructive">
                  {t(`accounts:${errors.balance.message}` as any)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">
                {t("accounts:createModal.currency")}
              </Label>
              <Input
                id="currency"
                placeholder="UAH"
                maxLength={3}
                {...register("currency")}
              />
              {errors.currency?.message && (
                <p className="text-sm text-destructive">
                  {t(`accounts:${errors.currency.message}` as any)}
                </p>
              )}
            </div>
          </div>
          {create.isError && (
            <p className="text-sm text-destructive">
              {getErrorMessage(create.error)}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              {t("common:buttons.cancel")}
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending
                ? t("accounts:createModal.submitting")
                : t("accounts:createModal.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditAccountDialog({
                             account,
                             onClose,
                           }: {
  account: Account | null;
  onClose: () => void;
}) {
  const { t } = useTranslation(["accounts", "common"]);
  const edit = useEditAccount(account?._id ?? "");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditAccountFormData>({
    resolver: zodResolver(editAccountSchema),
    values: account
      ? { name: account.name, type: account.type, currency: account.currency }
      : undefined,
  });

  const onSubmit = (data: EditAccountFormData) => {
    edit.mutate(
      {
        name: data.name,
        type: data.type,
        currency: data.currency.toUpperCase(),
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  const close = () => {
    onClose();
    edit.reset();
  };

  return (
    <Dialog open={account !== null} onOpenChange={(v) => !v && close()}>
      <DialogContent onClose={close}>
        <DialogHeader>
          <DialogTitle>{t("accounts:editModal.title")}</DialogTitle>
          <DialogDescription>
            {t("accounts:editModal.description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">{t("accounts:createModal.title")}</Label>
            <Input id="edit-name" {...register("name")} />
            {errors.name?.message && (
              <p className="text-sm text-destructive">
                {t(`accounts:${errors.name.message}` as any)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-type">{t("accounts:filters.type")}</Label>
            <Select id="edit-type" {...register("type")}>
              <option value={AccountType.Cash}>{t("accounts:types.cash")}</option>
              <option value={AccountType.Bank}>{t("accounts:types.bank")}</option>
              <option value={AccountType.Savings}>{t("accounts:types.savings")}</option>
            </Select>
            {errors.type?.message && (
              <p className="text-sm text-destructive">
                {t(`accounts:${errors.type.message}` as any)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-currency">
              {t("accounts:createModal.currency")}
            </Label>
            <Input
              id="edit-currency"
              maxLength={3}
              {...register("currency")}
            />
            {errors.currency?.message && (
              <p className="text-sm text-destructive">
                {t(`accounts:${errors.currency.message}` as any)}
              </p>
            )}
          </div>
          {edit.isError && (
            <p className="text-sm text-destructive">
              {getErrorMessage(edit.error)}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              {t("common:buttons.cancel")}
            </Button>
            <Button type="submit" disabled={edit.isPending}>
              {edit.isPending
                ? t("accounts:editModal.submitting")
                : t("accounts:editModal.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}