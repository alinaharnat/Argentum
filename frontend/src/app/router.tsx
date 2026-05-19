import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { AccountsPage } from "@/features/accounts/pages/AccountsPage";
import { CategoriesPage } from "@/features/categories/pages/CategoriesPage";
import { TransactionsPage } from "@/features/transactions/pages/TransactionsPage";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 text-muted-foreground">Сторінка в розробці</p>
    </div>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/budgets" element={<Placeholder title="Бюджети" />} />
          <Route path="/goals" element={<Placeholder title="Цілі" />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
