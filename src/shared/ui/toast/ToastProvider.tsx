import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { Toast } from '../molecules/Toast.tsx'

type ToastTone = 'success' | 'error'

type ToastItem = {
  id: number
  tone: ToastTone
  title: string
  body?: string
}

type ToastApi = {
  success: (title: string, body?: string) => void
  error: (title: string, body?: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const push = useCallback((tone: ToastTone, title: string, body?: string) => {
    const id = Date.now() + Math.random()
    setItems((current) => [...current, { id, tone, title, body }])
    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id))
    }, 4000)
  }, [])

  const api = useMemo<ToastApi>(
    () => ({
      success: (title, body) => push('success', title, body),
      error: (title, body) => push('error', title, body),
    }),
    [push],
  )

  function close(id: number) {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="hs-toasts">
        {items.map((item) => (
          <Toast key={item.id} tone={item.tone} title={item.title} body={item.body} onClose={() => close(item.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const api = useContext(ToastContext)
  if (!api) throw new Error('useToast harus dipakai di dalam ToastProvider')
  return api
}
