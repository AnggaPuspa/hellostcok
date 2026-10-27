import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import logo from '@/assets/auth/stock-symbol.svg'
import { LanguageSwitcher } from '@/shared/ui/i18n/LanguageSwitcher.tsx'
import '@/styles/public-page.css'

type PublicPageProps = {
  kicker: string
  title: string
  lead: string
  children: ReactNode
}

export function PublicPage({ kicker, title, lead, children }: PublicPageProps) {
  const { t } = useTranslation()

  return (
    <div className="hs-public">
      <header className="hs-public-header">
        <div className="hs-public-shell hs-public-header-inner">
          <Link to="/" className="hs-public-logo" aria-label={t('common.brand')}>
            <img src={logo} alt="" width={28} height={28} />
            <span>{t('common.brand')}</span>
          </Link>
          <nav className="hs-public-nav" aria-label={t('landing.nav.menu')}>
            <Link to="/">{t('common.home')}</Link>
            <Link to="/panduan">{t('common.guide')}</Link>
            <Link to="/kontak">{t('common.contact')}</Link>
            <LanguageSwitcher variant="plain" />
            <Link to="/login">{t('common.login')}</Link>
          </nav>
        </div>
      </header>

      <main className="hs-public-shell hs-public-main">
        <p className="hs-public-kicker">{kicker}</p>
        <h1>{title}</h1>
        <p className="hs-public-lead">{lead}</p>
        {children}
      </main>

      <footer className="hs-public-footer">
        <div className="hs-public-shell">
          <p>{t('landing.footer.copyright', { year: new Date().getFullYear() })}</p>
          <Link to="/">{t('common.home')}</Link>
        </div>
      </footer>
    </div>
  )
}
