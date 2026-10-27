import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { LoginPage } from '@/features/auth/ui/LoginPage.tsx'
import { RegisterPage } from '@/features/auth/ui/RegisterPage.tsx'
import { LandingPage } from '@/features/landing/ui/LandingPage.tsx'
import { StatusPage } from '@/features/status/ui/StatusPage.tsx'
import { GuidePage } from '@/features/guide/ui/GuidePage.tsx'
import { ContactPage } from '@/features/company/ui/ContactPage.tsx'
import { LegalPage } from '@/features/company/ui/LegalPage.tsx'
import { SecurityPage } from '@/features/company/ui/SecurityPage.tsx'
import { RequireAuth } from '@/features/auth/ui/RequireAuth.tsx'
import { RequireRole } from '@/features/auth/ui/RequireRole.tsx'
import { DashboardPage } from '@/features/dashboard/ui/DashboardPage.tsx'
import { UserFormPage } from '@/features/auth/ui/UserFormPage.tsx'
import { UserResultPage } from '@/features/auth/ui/UserResultPage.tsx'
import { UsersPage } from '@/features/auth/ui/UsersPage.tsx'
import { DamageDetailPage } from '@/features/damage/ui/DamageDetailPage.tsx'
import { DamageDispositionPage } from '@/features/damage/ui/DamageDispositionPage.tsx'
import { DamageFormPage } from '@/features/damage/ui/DamageFormPage.tsx'
import { DamagePage } from '@/features/damage/ui/DamagePage.tsx'
import { OpnameDetailPage } from '@/features/opname/ui/OpnameDetailPage.tsx'
import { OpnameFormPage } from '@/features/opname/ui/OpnameFormPage.tsx'
import { OpnamePage } from '@/features/opname/ui/OpnamePage.tsx'
import { ReportDetailPage } from '@/features/report/ui/ReportDetailPage.tsx'
import { ReportPage } from '@/features/report/ui/ReportPage.tsx'
import { ReceiptDetailPage } from '@/features/receipt/ui/ReceiptDetailPage.tsx'
import { ReceiptFormPage } from '@/features/receipt/ui/ReceiptFormPage.tsx'
import { ReceiptPage } from '@/features/receipt/ui/ReceiptPage.tsx'
import { ProductDetailPage } from '@/features/stock/ui/ProductDetailPage.tsx'
import { ProductFormPage } from '@/features/stock/ui/ProductFormPage.tsx'
import { ProductPage } from '@/features/stock/ui/ProductPage.tsx'
import { ProductPrintPage } from '@/features/stock/ui/ProductPrintPage.tsx'
import { AppFrame } from '@/shared/ui/layout/AppFrame.tsx'
import { ToastProvider } from '@/shared/ui/toast/ToastProvider.tsx'

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<Navigate to="/" replace />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/panduan" element={<GuidePage />} />
        <Route path="/kontak" element={<ContactPage />} />
        <Route path="/syarat-privasi" element={<LegalPage />} />
        <Route path="/keamanan" element={<SecurityPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          element={
            <RequireAuth>
              <RequireRole>
                <AppFrame />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/produk" element={<ProductPage />} />
          <Route path="/produk/tambah" element={<ProductFormPage />} />
          <Route path="/produk/:id" element={<ProductDetailPage />} />
          <Route path="/produk/:id/ubah" element={<ProductFormPage />} />
          <Route path="/produk/:id/cetak" element={<ProductPrintPage />} />
          <Route path="/penerimaan" element={<ReceiptPage />} />
          <Route path="/penerimaan/baru" element={<ReceiptFormPage />} />
          <Route path="/penerimaan/:id" element={<ReceiptDetailPage />} />
          <Route path="/penjualan" element={<ReceiptPage kind="out" />} />
          <Route path="/penjualan/baru" element={<ReceiptFormPage kind="out" />} />
          <Route path="/penjualan/:id" element={<ReceiptDetailPage kind="out" />} />
          <Route path="/barang-rusak" element={<DamagePage />} />
          <Route path="/barang-rusak/baru" element={<DamageFormPage />} />
          <Route path="/barang-rusak/:id/disposisi" element={<DamageDispositionPage />} />
          <Route path="/barang-rusak/:id" element={<DamageDetailPage />} />
          <Route path="/opname" element={<OpnamePage />} />
          <Route path="/opname/baru" element={<OpnameFormPage />} />
          <Route path="/opname/:id" element={<OpnameDetailPage />} />
          <Route path="/laporan" element={<ReportPage />} />
          <Route path="/laporan/:sku" element={<ReportDetailPage />} />
          <Route path="/pengguna" element={<UsersPage />} />
          <Route path="/pengguna/tambah" element={<UserFormPage />} />
          <Route path="/pengguna/hasil" element={<UserResultPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
