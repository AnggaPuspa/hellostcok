import type { ReactNode } from 'react'
import { Heading } from '../atoms/Heading.tsx'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Fake server · /api</p>
          <Heading>Hello Stock</Heading>
        </div>
        <p className="topbar-note">Data barang hidup di server palsu, bukan di komponen.</p>
      </header>
      <main>{children}</main>
    </div>
  )
}
