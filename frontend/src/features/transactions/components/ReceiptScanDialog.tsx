import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Upload,
  ScanLine,
  Loader2,
  Check,
  RotateCcw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/features/categories/icons";
import { getCategoryDisplayName } from "@/features/categories/labels";
import type { Category } from "@/features/categories/types";
import { CategoryType } from "@/features/categories/types";
import { analyzeReceipt, type ScannedReceipt } from "../receiptScan";
import { TransactionType } from "../types";
import type { TransactionFormData } from "../schemas";
import { formatAmount } from "../utils";

type Stage = "idle" | "analyzing" | "done";

const ANALYZE_STEPS = [
  "Завантаження зображення…",
  "Розпізнавання тексту (OCR)…",
  "Пошук суми та дати…",
  "Визначення категорії…",
];

export function ReceiptScanDialog({
  open,
  categories,
  onClose,
  onConfirm,
}: {
  open: boolean;
  categories: Category[];
  onClose: () => void;
  onConfirm: (prefill: Partial<TransactionFormData>, category?: Category) => void;
}) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ScannedReceipt | null>(null);

  // Revoke object URLs to avoid leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setResult(null);
    setStepIndex(0);
    setStage("idle");
  };

  const close = () => {
    reset();
    onClose();
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setStage("analyzing");
    setStepIndex(0);
  };

  // Drive the simulated analysis once we enter the "analyzing" stage
  useEffect(() => {
    if (stage !== "analyzing") return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    ANALYZE_STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) setStepIndex(i);
        }, i * 650),
      );
    });

    timers.push(
      setTimeout(
        () => {
          if (cancelled) return;
          setResult(analyzeReceipt());
          setStage("done");
        },
        ANALYZE_STEPS.length * 650 + 350,
      ),
    );

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [stage]);

  const matchedCategory = result
    ? matchCategory(categories, result.suggestedIcon)
    : undefined;

  const confirm = () => {
    if (!result) return;
    const prefill: Partial<TransactionFormData> = {
      type: TransactionType.Expense,
      amount: result.amount.toFixed(2),
      date: result.date,
      description: result.merchant,
      categoryId: matchedCategory?._id ?? "",
    };
    onConfirm(prefill, matchedCategory);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && close()}>
      <DialogContent onClose={close} className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5 text-primary" />
            Сканування чека
          </DialogTitle>
          <DialogDescription>
            Сфотографуйте чек — ми автоматично розпізнаємо суму, дату та
            категорію.
          </DialogDescription>
        </DialogHeader>

        {/* Hidden inputs: camera capture + gallery upload */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <input
          ref={uploadInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {stage === "idle" && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Camera className="h-7 w-7" />
              </div>
              <p className="text-sm text-muted-foreground">
                Наведіть камеру на чек або завантажте фото
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => cameraInputRef.current?.click()}>
                <Camera className="mr-2 h-4 w-4" />
                Зробити фото
              </Button>
              <Button
                variant="outline"
                onClick={() => uploadInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Завантажити
              </Button>
            </div>
          </div>
        )}

        {stage === "analyzing" && (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg border bg-muted">
              {preview && (
                <img
                  src={preview}
                  alt="Чек"
                  className="max-h-56 w-full object-contain opacity-80"
                />
              )}
              {/* scanning line animation */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-x-0 top-0 h-1 animate-bounce bg-primary/70 shadow-[0_0_12px] shadow-primary" />
              </div>
            </div>
            <div className="space-y-2">
              {ANALYZE_STEPS.map((label, i) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    i < stepIndex
                      ? "text-foreground"
                      : i === stepIndex
                        ? "text-foreground"
                        : "text-muted-foreground/50",
                  )}
                >
                  {i < stepIndex ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : i === stepIndex ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <span className="h-4 w-4" />
                  )}
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === "done" && result && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              <Check className="h-4 w-4" />
              Чек розпізнано
            </div>

            <div className="rounded-lg border bg-card">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                  <p className="font-medium">{result.merchant}</p>
                  <p className="text-xs text-muted-foreground">{result.date}</p>
                </div>
                {matchedCategory && (
                  <div className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs">
                    <CategoryIcon
                      icon={matchedCategory.icon}
                      color={matchedCategory.color}
                      className="h-3.5 w-3.5"
                    />
                    {getCategoryDisplayName(matchedCategory)}
                  </div>
                )}
              </div>
              <div className="divide-y">
                {result.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-2 text-sm"
                  >
                    <span className="truncate text-muted-foreground">
                      {item.name}
                    </span>
                    <span className="tabular-nums">
                      {item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t px-4 py-3 font-semibold">
                <span>Разом</span>
                <span className="tabular-nums">
                  {formatAmount(result.amount, "UAH")}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Перевірте дані — наступним кроком ви зможете відредагувати їх у
              формі транзакції.
            </p>
          </div>
        )}

        <DialogFooter>
          {stage === "done" ? (
            <>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Сканувати інший
              </Button>
              <Button onClick={confirm}>Створити транзакцію</Button>
            </>
          ) : (
            <Button variant="outline" onClick={close}>
              Скасувати
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function matchCategory(
  categories: Category[],
  icon: string,
): Category | undefined {
  const expense = categories.filter((c) => c.type === CategoryType.Expense);
  return expense.find((c) => c.icon === icon) ?? expense[0];
}
