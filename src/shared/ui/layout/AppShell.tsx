import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { logout } from '@/features/auth/model/session.ts'
import { Text } from '../atoms/Text.tsx'
import { Button } from '../atoms/Button.tsx'
import { Heading } from '../atoms/Heading.tsx'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <Text className="eyebrow">Fake server · /api</Text>
          <Heading>Hello Stock</Heading>
        </div>
        <Button variant="secondary" onClick={handleLogout}>Keluar</Button>
      </header>
      <main>{children}</main>
    </div>
  )
}
