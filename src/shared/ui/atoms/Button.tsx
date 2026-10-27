import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'soft'
  size?: 'md' | 'lg'
  block?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`hs-btn hs-btn-${variant} hs-btn-${size} ${block ? 'hs-btn-block' : ''} ${className}`.trim()}
      {...props}
    />
  )
}
