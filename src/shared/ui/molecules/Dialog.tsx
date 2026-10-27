import { useEffect, type ReactNode } from 'react'
import { Button } from '../atoms/Button.tsx'
import { Heading } from '../atoms/Heading.tsx'
import { Text } from '../atoms/Text.tsx'

type DialogProps = {
  title: string
  body?: ReactNode
  detail?: ReactNode
  note?: ReactNode
  cancelLabel?: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
}

export function Dialog({ title, body, detail, note, cancelLabel, confirmLabel, onCancel, onConfirm }: DialogProps) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div className="hs-dialog-backdrop" onClick={onCancel}>
      <section
        className="hs-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hs-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <Heading level={2} id="hs-dialog-title">{title}</Heading>
        {body ? <Text>{body}</Text> : null}
        {detail ? <Text className="hs-dialog-detail">{detail}</Text> : null}
        {note ? <Text className="hs-dialog-note">{note}</Text> : null}
        <div className="hs-dialog-actions">
          {cancelLabel ? (
            <Button variant="secondary" onClick={onCancel}>
              {cancelLabel}
            </Button>
          ) : null}
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </section>
    </div>
  )
}
