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
import { loginSchema, type LoginFormData } from "../schemas";
import { useLogin } from "../hooks";
import { getErrorMessage } from "@/lib/axios";

export function LoginPage() {
  const { t } = useTranslation("auth");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const login = useLogin();

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 relative">
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Logo className="h-7 w-7" />
            {t("login.title")}
          </CardTitle>
          <CardDescription>
            {t("login.description")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("fields.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
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
                {...register("password")}
              />
              {errors.password?.message && (
                <p className="text-sm text-destructive">
                  {t(errors.password.message as any)}
                </p>
              )}
            </div>
            {login.isError && (
              <p className="text-sm text-destructive">
                {getErrorMessage(login.error)}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? t("login.submitting") : t("login.submit")}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t("login.noAccount")}{" "}
              <Link to="/register" className="text-primary hover:underline">
                {t("login.registerLink")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}