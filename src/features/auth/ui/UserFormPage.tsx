import { useState } from 'react'
import { useNavigate } from 'react-router'
import { createAccount, getSession, type Role } from '../model/session.ts'
import { createNotice, roles } from '../model/users.form.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { SelectField } from '@/shared/ui/atoms/SelectField.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'

export function UserFormPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const session = getSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('petugas')
  const [active, setActive] = useState(true)
  const [busy, setBusy] = useState(false)

  const when = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())

  async function submit() {
    setBusy(true)
    try {
      const result = await createAccount({ name, email, role, active })
      toast.success('User berhasil dibuat.', result.account.name)
      navigate('/pengguna/hasil', {
        state: { kind: 'created', account: result.account, password: result.password },
        replace: true,
      })
    } catch (error: unknown) {
      toast.error('User gagal dibuat.', failureText(error, 'Periksa nama dan email.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="dash-page">
      <PageHeader section="Kelola User · Tambah" detail={`${when} · ${session?.name ?? ''}`} />
      <Card title="Tambah user" className="product-card">
        <TextField label="Nama" name="user-name" value={name} onChange={(event) => setName(event.target.value)} />
        <TextField
          label="Email"
          name="user-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <div className="product-pair">
          <SelectField label="Peran" name="user-role" value={role} onChange={(event) => setRole(event.target.value as Role)}>
            {roles.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Status"
            name="user-active"
            value={active ? 'active' : 'inactive'}
            onChange={(event) => setActive(event.target.value === 'active')}
          >
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </SelectField>
        </div>
        <Text className="product-block">{createNotice}</Text>
        <div className="product-form-actions">
          <Button variant="secondary" onClick={() => navigate('/pengguna')}>
            Batal
          </Button>
          <Button disabled={busy || !name.trim() || !email.trim()} onClick={() => void submit()}>
            Tambah user
          </Button>
        </div>
      </Card>
    </section>
  )
}
