import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { registerSchema, type RegisterFormData } from "../schemas";
import { useRegister } from "../hooks";
import { getErrorMessage } from "@/lib/axios";

export function RegisterPage() {
  const { t } = useTranslation("auth");
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const register = useRegister();

  const onSubmit = (data: RegisterFormData) => {
    register.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8 relative">
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Logo className="h-7 w-7" />
            {t("register.title")}
          </CardTitle>
          <CardDescription>
            {t("register.description")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("register.firstName")}</Label>
                <Input id="firstName" {...registerField("firstName")} />
                {errors.firstName?.message && (
                  <p className="text-sm text-destructive">
                    {t(errors.firstName.message as any)}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("register.lastName")}</Label>
                <Input id="lastName" {...registerField("lastName")} />
                {errors.lastName?.message && (
                  <p className="text-sm text-destructive">
                    {t(errors.lastName.message as any)}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("fields.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...registerField("email")}
              />
              {errors.email?.message && (
                <p className="text-sm text-destructive">
                  {t(errors.email.message as any)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("fields.password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...registerField("password")}
              />
              {errors.password?.message && (
                <p className="text-sm text-destructive">
                  {t(errors.password.message as any)}
                </p>
              )}
            </div>
            {register.isError && (
              <p className="text-sm text-destructive">
                {getErrorMessage(register.error)}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full"
              disabled={register.isPending}
            >
              {register.isPending ? t("register.submitting") : t("register.submit")}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t("register.hasAccount")}{" "}
              <Link to="/login" className="text-primary hover:underline">
                {t("register.loginLink")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}