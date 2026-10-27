import { Button } from '../atoms/Button.tsx'
import { Text } from '../atoms/Text.tsx'

type ToastProps = {
  tone: 'success' | 'error'
  title: string
  body?: string
  onClose: () => void
}

export function Toast({ tone, title, body, onClose }: ToastProps) {
  return (
    <article className={`hs-toast hs-toast-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <div>
        <Text className="hs-toast-title">{title}</Text>
        {body ? <Text className="hs-toast-body">{body}</Text> : null}
      </div>
      <Button className="hs-toast-close" aria-label="Tutup" onClick={onClose}>
        ×
      </Button>
    </article>
  )
}
