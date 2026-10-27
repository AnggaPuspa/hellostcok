import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { PublicPage } from '@/shared/ui/layout/PublicPage.tsx'

export function ContactPage() {
  const { t } = useTranslation()
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <PublicPage kicker={t('contact.kicker')} title={t('contact.title')} lead={t('contact.lead')}>
      {sent ? (
        <>
          <p>{t('contact.sent')}</p>
          <div className="hs-public-actions">
            <Link className="hs-public-btn" to="/login">
              {t('contact.loginCta')}
            </Link>
            <Link className="hs-public-link" to="/panduan">
              {t('contact.guideCta')}
            </Link>
          </div>
        </>
      ) : (
        <form className="hs-public-form" onSubmit={handleSubmit}>
          <div className="hs-public-field">
            <label htmlFor="contact-name">{t('contact.name')}</label>
            <input id="contact-name" name="name" type="text" required autoComplete="name" />
          </div>
          <div className="hs-public-field">
            <label htmlFor="contact-email">{t('contact.email')}</label>
            <input id="contact-email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="hs-public-field">
            <label htmlFor="contact-message">{t('contact.message')}</label>
            <textarea id="contact-message" name="message" required />
          </div>
          <button className="hs-public-submit" type="submit">
            {t('contact.submit')}
          </button>
          <p className="hs-public-note">{t('contact.note')}</p>
        </form>
      )}
    </PublicPage>
  )
}
