import symbol from '@/assets/auth/stock-symbol.svg'

type LogoProps = {
  tone?: 'ink' | 'white'
}

export function Logo({ tone = 'ink' }: LogoProps) {
  return (
    <div className={`auth-logo auth-logo-${tone}`}>
      <img src={symbol} alt="" width="53.8095" height="53.8095" />
      <span>Hello Stock</span>
    </div>
  )
}
