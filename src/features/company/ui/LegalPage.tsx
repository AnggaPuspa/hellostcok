import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { PublicPage } from '@/shared/ui/layout/PublicPage.tsx'

export function LegalPage() {
  const { t } = useTranslation()
  const terms = t('legal.terms', { returnObjects: true }) as string[]
  const privacy = t('legal.privacy', { returnObjects: true }) as string[]

  return (
    <PublicPage kicker={t('legal.kicker')} title={t('legal.title')} lead={t('legal.lead')}>
      <h2>{t('legal.termsTitle')}</h2>
      <ul>
        {terms.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{t('legal.privacyTitle')}</h2>
      <ul>
        {privacy.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{t('legal.contactTitle')}</h2>
      <p>
        {t('legal.contactBody')}{' '}
        <Link to="/kontak">{t('common.contact')}</Link>.
      </p>

      <div className="hs-public-actions">
        <Link className="hs-public-btn" to="/keamanan">
          {t('legal.securityCta')}
        </Link>
        <Link className="hs-public-link" to="/">
          {t('legal.homeCta')}
        </Link>
      </div>
    </PublicPage>
  )
}
