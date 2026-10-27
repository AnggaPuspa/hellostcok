import { NavLink, useNavigate } from 'react-router'
import { getSession, logout } from '@/features/auth/model/session.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Heading } from '@/shared/ui/atoms/Heading.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { brandMark, navFor, sidebarIcon } from './nav.ts'

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate()
  const toast = useToast()
  const session = getSession()
  const items = navFor(session?.role ?? 'admin')

  function handleLogout() {
    logout()
    toast.success('Berhasil keluar.')
    navigate('/login')
  }

  return (
    <aside className={collapsed ? 'side is-collapsed' : 'side'}>
      <div className="side-brand">
        <img src={brandMark.src} alt="" width={brandMark.width} height={brandMark.height} />
        <Heading level={3}>Hello Stock</Heading>
        <Button className="side-toggle" aria-label={collapsed ? 'Buka sidebar' : 'Tutup sidebar'} onClick={onToggle}>
          <img src={sidebarIcon.src} alt="" width={sidebarIcon.width} height={sidebarIcon.height} />
        </Button>
      </div>
      <nav className="side-nav" aria-label="Menu utama">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? 'side-link is-active' : 'side-link')}
            title={item.label}
          >
            <Text as="span" className="side-icon">
              <img src={item.icon} alt="" width={item.width} height={item.height} />
            </Text>
            <Text as="span" className="side-label">{item.label}</Text>
          </NavLink>
        ))}
      </nav>
      <Button className="side-logout" onClick={handleLogout}>
        Keluar
      </Button>
    </aside>
  )
}
