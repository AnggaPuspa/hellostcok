import { Navigate, useLocation, useNavigate } from 'react-router'
import { getSession, type AccountView } from '../model/session.ts'
import {
  accountLine,
  activateNotice,
  deactivateNotice,
  oncePasswordNotice,
} from '../model/users.form.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Pill } from '@/shared/ui/atoms/Pill.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'

type ResultState =
  | { kind: 'created'; account: AccountView; password: string }
  | { kind: 'reset'; account: AccountView; password: string }
  | { kind: 'off'; account: AccountView }
  | { kind: 'on'; account: AccountView }

function isResultState(value: unknown): value is ResultState {
  if (!value || typeof value !== 'object') return false
  const state = value as ResultState
  return state.kind === 'created' || state.kind === 'reset' || state.kind === 'off' || state.kind === 'on'
}

export function UserResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const session = getSession()
  const state = isResultState(location.state) ? location.state : null

  const when = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())

  if (!state) return <Navigate to="/pengguna" replace />

  const titles = {
    created: { section: 'Kelola User · User dibuat', card: 'User berhasil dibuat' },
    reset: { section: 'Kelola User · Reset berhasil', card: 'Kata sandi berhasil direset' },
    off: { section: 'Nonaktifkan berhasil', card: 'Nonaktifkan berhasil' },
    on: { section: 'Aktifkan berhasil', card: 'Aktifkan berhasil' },
  }[state.kind]

  const note =
    state.kind === 'created' || state.kind === 'reset'
      ? oncePasswordNotice
      : state.kind === 'off'
        ? deactivateNotice
        : activateNotice

  async function copyPassword() {
    if (state?.kind !== 'created' && state?.kind !== 'reset') return
    try {
      await navigator.clipboard.writeText(state.password)
      toast.success('Kata sandi disalin.', state.password)
    } catch {
      toast.error('Salin gagal.', 'Salin manual dari kolom kata sandi.')
    }
  }

  return (
    <section className="dash-page">
      <PageHeader section={titles.section} detail={`${when} · ${session?.name ?? ''}`} />
      <Card title={titles.card} className="product-card">
        <Pill tone="up">Contoh</Pill>
        <Text>{accountLine(state.account)}</Text>
        <Text className="product-block">{note}</Text>
        {state.kind === 'created' || state.kind === 'reset' ? (
          <TextField label="Kata sandi · Contoh" name="user-password" value={state.password} readOnly />
        ) : null}
        <div className="product-form-actions product-form-actions-start">
          {state.kind === 'created' || state.kind === 'reset' ? (
            <Button variant="secondary" onClick={() => void copyPassword()}>
              Salin
            </Button>
          ) : null}
          <Button onClick={() => navigate('/pengguna', { replace: true })}>Selesai</Button>
        </div>
      </Card>
    </section>
  )
}
