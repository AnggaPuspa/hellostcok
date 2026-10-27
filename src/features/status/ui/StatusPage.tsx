import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import logo from '@/assets/auth/stock-symbol.svg'
import { LanguageSwitcher } from '@/shared/ui/i18n/LanguageSwitcher.tsx'
import '@/styles/status.css'

const serviceIds = ['web', 'api', 'inventory', 'qc', 'reports'] as const

export function StatusPage() {
  const { t, i18n } = useTranslation()
  const updatedAt = new Date().toLocaleString(i18n.language === 'en' ? 'en-US' : 'id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="hs-status">
      <header className="hs-status-header">
        <div className="hs-status-shell hs-status-header-inner">
          <Link to="/" className="hs-status-logo" aria-label={t('common.brand')}>
            <img src={logo} alt="" width={28} height={28} />
            <span>{t('common.brand')}</span>
          </Link>
          <nav className="hs-status-nav" aria-label={t('landing.nav.menu')}>
            <Link to="/">{t('common.home')}</Link>
            <Link to="/panduan">{t('common.guide')}</Link>
            <Link to="/kontak">{t('common.contact')}</Link>
            <LanguageSwitcher variant="plain" />
            <Link to="/login">{t('common.login')}</Link>
          </nav>
        </div>
      </header>

      <main className="hs-status-shell hs-status-main">
        <h1>{t('status.title')}</h1>
        <p className="hs-status-summary" role="status">
          {t('status.summary', { time: updatedAt })}
        </p>

        <ul className="hs-status-list">
          {serviceIds.map((id) => (
            <li key={id}>
              <span>{t(`status.services.${id}`)}</span>
              <span className="hs-status-ok">{t('status.ok')}</span>
            </li>
          ))}
        </ul>
      </main>

      <footer className="hs-status-footer">
        <div className="hs-status-shell">
          <p>{t('landing.footer.copyright', { year: new Date().getFullYear() })}</p>
          <Link to="/">{t('common.home')}</Link>
        </div>
      </footer>
    </div>
  )
}
