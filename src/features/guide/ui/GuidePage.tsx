import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import logo from '@/assets/auth/stock-symbol.svg'
import { LanguageSwitcher } from '@/shared/ui/i18n/LanguageSwitcher.tsx'
import '@/styles/guide.css'

const sectionIds = ['mulai', 'peran', 'stok', 'qc', 'laporan'] as const

export function GuidePage() {
  const { t } = useTranslation()

  return (
    <div className="hs-guide">
      <header className="hs-guide-header">
        <div className="hs-guide-shell hs-guide-header-inner">
          <Link to="/" className="hs-guide-logo" aria-label={t('common.brand')}>
            <img src={logo} alt="" width={28} height={28} />
            <span>{t('common.brand')}</span>
          </Link>
          <nav className="hs-guide-nav" aria-label={t('landing.nav.menu')}>
            <Link to="/">{t('common.home')}</Link>
            <Link to="/kontak">{t('common.contact')}</Link>
            <LanguageSwitcher variant="plain" />
            <Link to="/login">{t('common.login')}</Link>
          </nav>
        </div>
      </header>

      <main className="hs-guide-shell hs-guide-main">
        <p className="hs-guide-kicker">{t('guide.kicker')}</p>
        <h1>{t('guide.title')}</h1>
        <p className="hs-guide-lead">{t('guide.lead')}</p>

        <nav className="hs-guide-toc" aria-label={t('guide.toc')}>
          {sectionIds.map((id) => (
            <a key={id} href={`#${id}`}>
              {t(`guide.sections.${id}.title`)}
            </a>
          ))}
        </nav>

        {sectionIds.map((id) => {
          const steps = t(`guide.sections.${id}.steps`, { returnObjects: true }) as string[]
          return (
            <section key={id} id={id} className="hs-guide-section">
              <h2>{t(`guide.sections.${id}.title`)}</h2>
              <ol>
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
          )
        })}

        <div className="hs-guide-actions">
          <Link className="hs-guide-btn" to="/login">
            {t('guide.loginCta')}
          </Link>
          <Link className="hs-guide-link" to="/register">
            {t('guide.registerCta')}
          </Link>
        </div>
      </main>

      <footer className="hs-guide-footer">
        <div className="hs-guide-shell">
          <p>{t('landing.footer.copyright', { year: new Date().getFullYear() })}</p>
          <Link to="/">{t('common.home')}</Link>
        </div>
      </footer>
    </div>
  )
}
