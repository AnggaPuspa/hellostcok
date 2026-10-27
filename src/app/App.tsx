import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { LoginPage } from '@/features/auth/ui/LoginPage.tsx'
import { RegisterPage } from '@/features/auth/ui/RegisterPage.tsx'
import { RequireAuth } from '@/features/auth/ui/RequireAuth.tsx'
import { StockPage } from '@/features/stock/ui/StockPage.tsx'
import { AppShell } from '@/shared/ui/layout/AppShell.tsx'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <AppShell>
                <StockPage />
              </AppShell>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
