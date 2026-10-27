import type { ReactNode } from 'react'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Fake server · /api</p>
          <h1>Hello Stock</h1>
        </div>
        <p className="topbar-note">Data barang hidup di server palsu, bukan di komponen.</p>
      </header>
      <main>{children}</main>
    </div>
  )
}
