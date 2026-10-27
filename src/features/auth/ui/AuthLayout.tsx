import type { ReactNode } from 'react'
import { Heading } from '@/shared/ui/atoms/Heading.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="auth-screen">
      <div className="auth-frame">
        <section className="auth-brand" aria-label="Hello Stock">
          <div className="auth-brand-copy">
            <Heading level={2}>
              Sederhanakan proses.
              <br />
              Maksimalkan hasil.
            </Heading>
            <Text>Fokus pada bisnis Anda, sementara kami mengelola detail stok harian.</Text>
          </div>
        </section>
        <section className="auth-panel">{children}</section>
      </div>
    </main>
  )
}
