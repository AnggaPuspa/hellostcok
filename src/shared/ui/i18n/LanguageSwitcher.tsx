import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import chevron from '@/assets/landing/whitepace/chevron.svg'
import globe from '@/assets/landing/whitepace/globe.svg'
import { locales, type AppLocale } from '@/shared/i18n'
import './language-switcher.css'

type LanguageSwitcherProps = {
  variant?: 'footer' | 'plain'
}

export function LanguageSwitcher({ variant = 'footer' }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const current = (i18n.language.startsWith('en') ? 'en' : 'id') as AppLocale
  const currentLabel = t(locales.find((locale) => locale.code === current)?.labelKey ?? 'common.langId')

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function setLocale(next: AppLocale) {
    void i18n.changeLanguage(next)
    setOpen(false)
  }

  return (
    <div
      ref={rootRef}
      className={`hs-lang ${variant === 'footer' ? 'is-footer' : 'is-plain'} ${open ? 'is-open' : ''}`}
    >
      <button
        type="button"
        className="hs-lang-trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={menuId}
        aria-label={t('common.language')}
        onClick={() => setOpen((value) => !value)}
      >
        <img src={globe} alt="" width={18} height={18} />
        <span>{currentLabel}</span>
        <img className="hs-lang-chevron" src={chevron} alt="" width={16} height={11} />
      </button>

      {open ? (
        <ul id={menuId} className="hs-lang-menu" role="listbox" aria-label={t('common.language')}>
          {locales.map((locale) => {
            const active = locale.code === current
            return (
              <li key={locale.code} role="option" aria-selected={active}>
                <button
                  type="button"
                  className={active ? 'is-active' : undefined}
                  onClick={() => setLocale(locale.code)}
                >
                  {t(locale.labelKey)}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
