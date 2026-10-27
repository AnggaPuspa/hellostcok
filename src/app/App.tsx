import { AppShell } from '@/shared/ui/layout/AppShell.tsx'
import { StockPage } from '@/features/stock/ui/StockPage.tsx'

export function App() {
  return (
    <AppShell>
      <StockPage />
    </AppShell>
  )
}
