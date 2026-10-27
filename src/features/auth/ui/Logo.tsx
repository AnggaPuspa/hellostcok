import symbol from '@/assets/auth/stock-symbol.svg'
import { Heading } from '@/shared/ui/atoms/Heading.tsx'

type LogoProps = {
  tone?: 'ink' | 'white'
}

export function Logo({ tone = 'ink' }: LogoProps) {
  return (
    <div className={`auth-logo auth-logo-${tone}`}>
      <img src={symbol} alt="" width="53.8095" height="53.8095" />
      <Heading level={3}>Hello Stock</Heading>
    </div>
  )
}
