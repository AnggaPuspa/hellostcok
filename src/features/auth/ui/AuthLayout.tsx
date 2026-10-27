import type { ReactNode } from 'react'

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="auth-screen">
      <div className="auth-frame">
        <section className="auth-brand" aria-label="Hello Stock">
          <div className="auth-brand-copy">
            <p>
              Sederhanakan proses.
              <br />
              Maksimalkan hasil.
            </p>
            <span>Fokus pada bisnis Anda, sementara kami mengelola detail stok harian.</span>
          </div>
        </section>
        <section className="auth-panel">{children}</section>
      </div>
    </main>
  )
}
