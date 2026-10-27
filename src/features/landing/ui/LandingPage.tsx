import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import logo from '@/assets/auth/stock-symbol.svg'
import heroImage from '@/assets/landing/Stockroom tablet with inventory dashboard.png'
import flowImage from '@/assets/landing/Warehouse receiving with cartons and clipboard.png'
import damageImage from '@/assets/landing/Damaged carton quality inspection.png'
import opnameImage from '@/assets/landing/Inventory dashboard desk review (1).png'
import arrow from '@/assets/landing/whitepace/arrow.svg'
import checkDark from '@/assets/landing/whitepace/check-dark.svg'
import checkLight from '@/assets/landing/whitepace/check-light.svg'
import underline from '@/assets/landing/whitepace/underline.svg'
import underlinePm from '@/assets/landing/whitepace/underline-pm.svg'
import underlineWt from '@/assets/landing/whitepace/underline-wt.svg'
import underlineCustom from '@/assets/landing/whitepace/underline-custom.svg'
import underlineData from '@/assets/landing/whitepace/underline-data.svg'
import underlineSays from '@/assets/landing/whitepace/underline-says.svg'
import heroWave from '@/assets/landing/whitepace/hero-wave.svg'
import inventoryOrbit from '@/assets/landing/inventory-orbit.png'
import inventoryWorkflow from '@/assets/landing/inventory-workflow.png'
import kopdesLogo from '@/assets/landing/partners/kopdes-merah-putih.png'
import mbgLogo from '@/assets/landing/partners/bgn-mbg.png'
import bulogLogo from '@/assets/landing/partners/bulog-transparent.png'
import posIndonesiaLogo from '@/assets/landing/partners/pos-indonesia-transparent.png'
import inventoryModulesOrbit from '@/assets/landing/inventory-modules-orbit.png'
import appsWaves from '@/assets/landing/whitepace/apps-waves.svg'
import socialFb from '@/assets/landing/whitepace/social-fb.svg'
import socialX from '@/assets/landing/whitepace/social-x.svg'
import socialIn from '@/assets/landing/whitepace/social-in.svg'
import ctaUnderline from '@/assets/landing/whitepace/cta-underline.svg'
import ctaWaves from '@/assets/landing/whitepace/cta-waves.png'
import quoteDark from '@/assets/landing/whitepace/quote-dark.svg'
import quoteLight from '@/assets/landing/whitepace/quote-light.svg'
import slider from '@/assets/landing/whitepace/slider.svg'
import prabowoPortrait from '@/assets/landing/profiles/prabowo-subianto.webp'
import gibranPortrait from '@/assets/landing/profiles/gibran-rakabuming-raka.webp'
import bahlilPortrait from '@/assets/landing/profiles/bahlil-lahadalia.webp'
import { LanguageSwitcher } from '@/shared/ui/i18n/LanguageSwitcher.tsx'

const planIds = ['free', 'shop', 'business'] as const
const planMeta = {
  free: { price: 'Rp0', featured: false },
  shop: { price: 'Rp149.000', featured: true },
  business: { price: 'Rp499.000', featured: false },
} as const

const testimonialMeta = [
  {
    id: 'prabowo',
    name: 'Prabowo Subianto',
    avatar: prabowoPortrait,
    avatarPosition: '50% 26%',
    featured: false,
  },
  {
    id: 'gibran',
    name: 'Gibran Rakabuming Raka',
    avatar: gibranPortrait,
    avatarPosition: '50% 26%',
    featured: true,
  },
  {
    id: 'bahlil',
    name: 'Bahlil Lahadalia',
    avatar: bahlilPortrait,
    avatarPosition: '50% 50%',
    featured: false,
  },
] as const

const collaborators = [
  { name: 'Kopdes Merah Putih', logo: kopdesLogo, className: 'is-kopdes' },
  { name: 'MBG · Badan Gizi Nasional', logo: mbgLogo, className: 'is-mbg' },
  { name: 'BULOG', logo: bulogLogo, className: 'is-bulog' },
  { name: 'Pos Indonesia', logo: posIndonesiaLogo, className: 'is-pos' },
] as const

function ArrowIcon() {
  return <img src={arrow} alt="" width={11} height={11} />
}

export function LandingPage() {
  const { t } = useTranslation()

  const navItems = [
    { label: t('landing.nav.modules'), href: '#modul' },
    { label: t('landing.nav.pricing'), href: '#harga' },
    { label: t('landing.nav.guide'), to: '/panduan' },
    { label: t('landing.nav.contact'), to: '/kontak' },
  ] as const

  return (
    <div className="wp">
      <header className="wp-header">
        <div className="wp-shell wp-header-inner">
          <Link to="/" className="wp-logo" aria-label={t('common.brand')}>
            <img src={logo} alt="" width={34} height={34} />
            <span>{t('common.brand')}</span>
          </Link>
          <div className="wp-header-right">
            <nav className="wp-nav" aria-label={t('landing.nav.menu')}>
              {navItems.map((item) =>
                'href' in item ? (
                  <a key={item.label} href={item.href}>
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.label} to={item.to}>
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
            <div className="wp-header-actions">
              <Link className="wp-btn wp-btn-login" to="/login">
                {t('common.login')}
              </Link>
              <Link className="wp-btn wp-btn-primary" to="/register">
                {t('common.register')}
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="wp-hero">
        <div className="wp-shell wp-hero-grid">
          <div className="wp-hero-copy">
            <h1>{t('landing.hero.title')}</h1>
            <p>{t('landing.hero.body')}</p>
            <Link className="wp-btn wp-btn-primary wp-btn-lg" to="/register">
              {t('landing.hero.cta')}
              <ArrowIcon />
            </Link>
          </div>
          <div className="wp-hero-media">
            <img src={heroImage} alt={t('landing.hero.imageAlt')} />
          </div>
        </div>
        <img className="wp-hero-wave" src={heroWave} alt="" />
      </section>

      <section className="wp-split" id="modul">
        <div className="wp-shell wp-split-grid">
          <div className="wp-split-copy">
            <h2>
              {t('landing.stock.title')}
              <img className="wp-underline-img" src={underlinePm} alt="" />
            </h2>
            <p>{t('landing.stock.body')}</p>
            <Link className="wp-btn wp-btn-primary" to="/register">
              {t('landing.stock.cta')}
              <ArrowIcon />
            </Link>
          </div>
          <div className="wp-split-media wp-media-photo">
            <img src={flowImage} alt={t('landing.stock.imageAlt')} />
          </div>
        </div>
      </section>

      <section className="wp-split" id="solutions">
        <div className="wp-shell wp-split-grid is-flip">
          <div className="wp-split-media wp-media-plain">
            <img src={inventoryOrbit} alt={t('landing.team.imageAlt')} />
          </div>
          <div className="wp-split-copy">
            <h2>
              {t('landing.team.title')}
              <img className="wp-underline-img" src={underlineWt} alt="" />
            </h2>
            <p>{t('landing.team.body')}</p>
            <Link className="wp-btn wp-btn-primary" to="/register">
              {t('landing.team.cta')}
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="wp-split wp-split-navy" id="resources">
        <div className="wp-shell wp-split-grid">
          <div className="wp-split-copy is-light">
            <h2>
              {t('landing.damage.title')}
              <img className="wp-underline-img" src={underline} alt="" />
            </h2>
            <p>{t('landing.damage.body')}</p>
            <Link className="wp-btn wp-btn-primary" to="/login">
              {t('landing.damage.cta')}
              <ArrowIcon />
            </Link>
          </div>
          <div className="wp-split-media wp-media-photo">
            <img src={damageImage} alt={t('landing.damage.imageAlt')} />
          </div>
        </div>
      </section>

      <section className="wp-split">
        <div className="wp-shell wp-split-grid is-flip">
          <div className="wp-split-media wp-media-photo">
            <img src={opnameImage} alt={t('landing.opname.imageAlt')} />
          </div>
          <div className="wp-split-copy">
            <h2>
              {t('landing.opname.title')}
              <img className="wp-underline-img" src={underlineCustom} alt="" />
            </h2>
            <p>{t('landing.opname.body')}</p>
            <Link className="wp-btn wp-btn-primary" to="/register">
              {t('landing.opname.cta')}
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="wp-pricing" id="harga">
        <div className="wp-shell">
          <div className="wp-pricing-head">
            <h2>
              {t('landing.pricing.title')}
              <img className="wp-underline-img wp-underline-center" src={underline} alt="" />
            </h2>
            <p>{t('landing.pricing.body')}</p>
          </div>
          <div className="wp-price-list">
            {planIds.map((planId) => {
              const meta = planMeta[planId]
              const features = t(`landing.pricing.plans.${planId}.features`, {
                returnObjects: true,
              }) as string[]
              return (
                <article key={planId} className={meta.featured ? 'wp-price is-featured' : 'wp-price'}>
                  <h3>{t(`landing.pricing.plans.${planId}.name`)}</h3>
                  <p className="wp-price-amount">
                    {meta.price}
                    {meta.price !== 'Rp0' ? (
                      <span className="wp-price-period">{t('landing.pricing.period')}</span>
                    ) : null}
                  </p>
                  <p className="wp-price-blurb">{t(`landing.pricing.plans.${planId}.blurb`)}</p>
                  <ul>
                    {features.map((feature) => (
                      <li key={feature}>
                        <img src={meta.featured ? checkLight : checkDark} alt="" width={20} height={20} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    className={meta.featured ? 'wp-btn wp-btn-primary wp-btn-price' : 'wp-btn wp-btn-price-outline'}
                    to="/register"
                  >
                    {t(`landing.pricing.plans.${planId}.cta`)}
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="wp-cta">
        <img className="wp-cta-waves" src={ctaWaves} alt="" />
        <div className="wp-shell wp-cta-inner">
          <div className="wp-cta-text">
            <h2>
              {t('landing.cta.title')}
              <img className="wp-cta-underline" src={ctaUnderline} alt="" />
            </h2>
            <p>{t('landing.cta.body')}</p>
          </div>
          <Link className="wp-btn wp-btn-primary wp-btn-lg" to="/register">
            {t('landing.cta.button')}
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <section className="wp-split wp-data" id="data">
        <div className="wp-shell wp-data-grid">
          <div className="wp-data-copy">
            <div className="wp-data-text">
              <h2>
                {t('landing.data.title')}
                <img className="wp-underline-data" src={underlineData} alt="" />
              </h2>
              <p>{t('landing.data.body')}</p>
            </div>
            <Link className="wp-btn wp-btn-primary" to="/login">
              {t('landing.data.cta')}
              <ArrowIcon />
            </Link>
          </div>
          <div className="wp-data-media">
            <img src={inventoryWorkflow} alt={t('landing.data.imageAlt')} />
          </div>
        </div>
      </section>

      <section className="wp-sponsors">
        <div className="wp-shell">
          <h2>
            {t('landing.sponsors.title')}
            <img className="wp-underline-img wp-underline-center" src={underline} alt="" />
          </h2>
          <ul className="wp-sponsors-row" aria-label={t('landing.sponsors.label')}>
            {collaborators.map((collaborator) => (
              <li key={collaborator.name} className={`wp-sponsor ${collaborator.className}`}>
                <img
                  src={collaborator.logo}
                  alt={collaborator.name}
                  loading="lazy"
                  decoding="async"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wp-apps">
        <img className="wp-apps-waves" src={appsWaves} alt="" aria-hidden="true" />
        <div className="wp-shell wp-apps-grid">
          <div className="wp-apps-media">
            <img src={inventoryModulesOrbit} alt={t('landing.apps.imageAlt')} />
          </div>
          <div className="wp-apps-copy">
            <div className="wp-apps-text">
              <h2>{t('landing.apps.title')}</h2>
              <p>{t('landing.apps.body')}</p>
            </div>
            <Link className="wp-btn wp-btn-primary" to="/register">
              {t('landing.apps.cta')}
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="wp-testimonials">
        <div className="wp-shell">
          <h2 className="wp-testimonials-title">
            {t('landing.testimonials.title')}
            <img className="wp-underline-says" src={underlineSays} alt="" />
          </h2>
          <div className="wp-testimonial-list">
            {testimonialMeta.map((item) => (
              <article key={item.id} className={item.featured ? 'wp-testimonial is-featured' : 'wp-testimonial'}>
                <div className="wp-testimonial-comment">
                  <img
                    className="wp-quote"
                    src={item.featured ? quoteLight : quoteDark}
                    alt=""
                    width={86}
                    height={61}
                  />
                  <p>{t(`landing.testimonials.items.${item.id}.quote`)}</p>
                </div>
                <div className="wp-testimonial-person">
                  <img
                    className="wp-avatar"
                    src={item.avatar}
                    alt={item.name}
                    width={95}
                    height={95}
                    style={{ objectPosition: item.avatarPosition }}
                  />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{t(`landing.testimonials.items.${item.id}.role`)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <img className="wp-slider" src={slider} alt="" width={60} height={12} />
        </div>
      </section>

      <footer className="wp-footer">
        <div className="wp-shell">
          <div className="wp-footer-grid">
            <div className="wp-footer-brand">
              <div className="wp-logo wp-logo-foot">
                <img src={logo} alt="" width={34} height={34} />
                <span>{t('common.brand')}</span>
              </div>
              <p>{t('landing.footer.brand')}</p>
            </div>
            <div>
              <h4>{t('landing.footer.product')}</h4>
              <a className="is-accent" href="#modul">
                {t('landing.footer.modules')}
              </a>
              <a href="#harga">{t('landing.footer.pricing')}</a>
              <a href="#data">{t('landing.footer.reports')}</a>
            </div>
            <div>
              <h4>{t('landing.footer.resources')}</h4>
              <Link to="/panduan">{t('landing.footer.guide')}</Link>
              <a href="#resources">{t('landing.footer.damage')}</a>
              <Link to="/status">{t('landing.footer.status')}</Link>
            </div>
            <div>
              <h4>{t('landing.footer.company')}</h4>
              <Link to="/login">{t('landing.footer.demo')}</Link>
              <Link to="/kontak">{t('landing.footer.contact')}</Link>
              <Link to="/keamanan">{t('landing.footer.security')}</Link>
            </div>
            <div className="wp-footer-try">
              <h4 className="wp-footer-try-title">{t('landing.footer.tryTitle')}</h4>
              <p>{t('landing.footer.tryBody')}</p>
              <Link className="wp-btn wp-btn-primary wp-btn-footer" to="/register">
                {t('landing.footer.tryCta')}
                <ArrowIcon />
              </Link>
            </div>
          </div>
          <div className="wp-footer-bottom">
            <div className="wp-footer-meta">
              <LanguageSwitcher />
              <Link to="/syarat-privasi">{t('landing.footer.legal')}</Link>
              <Link to="/keamanan">{t('landing.footer.security')}</Link>
              <Link to="/status">{t('landing.footer.status')}</Link>
              <span>{t('landing.footer.copyright', { year: new Date().getFullYear() })}</span>
            </div>
            <div className="wp-socials">
              <a href="https://facebook.com" aria-label="Facebook">
                <img src={socialFb} alt="" width={9} height={17} />
              </a>
              <a href="https://twitter.com" aria-label="X">
                <img src={socialX} alt="" width={17} height={15} />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn">
                <img src={socialIn} alt="" width={15} height={15} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
