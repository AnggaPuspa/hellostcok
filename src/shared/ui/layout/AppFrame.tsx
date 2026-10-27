import { useState } from 'react'
import { Outlet } from 'react-router'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { bellIcon, searchIcon } from './nav.ts'
import { Sidebar } from './Sidebar.tsx'

export function AppFrame() {
  const [collapsed, setCollapsed] = useState(false)
  const [query, setQuery] = useState('')

  return (
    <div className={collapsed ? 'app-frame is-collapsed' : 'app-frame'}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((open) => !open)} />
      <div className="app-main">
        <header className="app-top">
          <TextField
            hideLabel
            className="app-search"
            label="Cari"
            name="app-search"
            type="search"
            value={query}
            placeholder="Cari"
            onChange={(event) => setQuery(event.target.value)}
            leading={<img src={searchIcon.src} alt="" width={searchIcon.width} height={searchIcon.height} />}
          />
          <Button className="app-bell" aria-label="Notifikasi">
            <img src={bellIcon.src} alt="" width={bellIcon.width} height={bellIcon.height} />
          </Button>
        </header>
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
