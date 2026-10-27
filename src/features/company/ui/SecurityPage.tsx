import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { PublicPage } from '@/shared/ui/layout/PublicPage.tsx'

export function SecurityPage() {
  const { t } = useTranslation()
  const access = t('security.access', { returnObjects: true }) as string[]
  const trail = t('security.trail', { returnObjects: true }) as string[]

  return (
    <PublicPage kicker={t('security.kicker')} title={t('security.title')} lead={t('security.lead')}>
      <h2>{t('security.accessTitle')}</h2>
      <ul>
        {access.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{t('security.trailTitle')}</h2>
      <ul>
        {trail.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{t('security.statusTitle')}</h2>
      <p>
        {t('security.statusBody')}{' '}
        <Link to="/status">{t('common.status')}</Link>.
      </p>

      <div className="hs-public-actions">
        <Link className="hs-public-btn" to="/status">
          {t('security.statusCta')}
        </Link>
        <Link className="hs-public-link" to="/syarat-privasi">
          {t('security.legalCta')}
        </Link>
      </div>
    </PublicPage>
  )
}
