import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  getSession,
  listAccounts,
  resetAccountPassword,
  setAccountActive,
  type AccountView,
} from '../model/session.ts'
import {
  displayName,
  selfDisableNote,
  statusFilters,
  statusLabel,
  type StatusFilter,
} from '../model/users.form.ts'
import { roleTitle } from '@/shared/ui/layout/nav.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Checkbox } from '@/shared/ui/atoms/Checkbox.tsx'
import { SelectField } from '@/shared/ui/atoms/SelectField.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { Dialog } from '@/shared/ui/molecules/Dialog.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableHeaderCell, TableRow } from '@/shared/ui/molecules/Table.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'

type UserDialog =
  | { kind: 'reset'; account: AccountView }
  | { kind: 'off'; account: AccountView }
  | { kind: 'on'; account: AccountView }

export function UsersPage() {
  const navigate = useNavigate()
  const session = getSession()
  const toast = useToast()
  const [accounts, setAccounts] = useState<AccountView[]>([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const [dialog, setDialog] = useState<UserDialog | null>(null)

  useEffect(() => {
    let active = true
    listAccounts()
      .then((list) => {
        if (active) setAccounts(list)
      })
      .catch((error: unknown) => {
        if (!active) return
        setAccounts([])
        toast.error('Daftar pengguna gagal dimuat.', failureText(error, 'Fake server tidak menjawab.'))
      })
    return () => {
      active = false
    }
  }, [toast])

  const when = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return accounts.filter((account) => {
      const haystack = `${account.name} ${account.email}`.toLowerCase()
      const matchesQuery = !needle || haystack.includes(needle)
      const matchesStatus =
        status === 'all' || (status === 'active' ? account.active : !account.active)
      return matchesQuery && matchesStatus
    })
  }, [accounts, query, status])

  const selected = visible.find((account) => account.email === selectedEmail) ?? null
  const selectedMine = Boolean(
    selected && session && selected.email.toLowerCase() === session.email.toLowerCase(),
  )

  async function confirmReset() {
    if (dialog?.kind !== 'reset') return
    try {
      const result = await resetAccountPassword(dialog.account.email)
      setDialog(null)
      toast.success('Kata sandi direset.', dialog.account.name)
      navigate('/pengguna/hasil', {
        state: { kind: 'reset', account: result.account, password: result.password },
        replace: false,
      })
    } catch (error: unknown) {
      toast.error('Reset kata sandi gagal.', failureText(error, 'Coba lagi.'))
    }
  }

  async function confirmActive(active: boolean) {
    if (!dialog || dialog.kind === 'reset') return
    try {
      const updated = await setAccountActive(dialog.account.email, active)
      if (!updated) {
        toast.error('Pengguna gagal dinonaktifkan.', 'Akun yang sedang masuk tidak bisa dinonaktifkan.')
        return
      }
      setDialog(null)
      toast.success(active ? 'Pengguna diaktifkan.' : 'Pengguna dinonaktifkan.', dialog.account.name)
      navigate('/pengguna/hasil', {
        state: { kind: active ? 'on' : 'off', account: updated },
      })
    } catch (error: unknown) {
      toast.error(active ? 'Pengguna gagal diaktifkan.' : 'Pengguna gagal dinonaktifkan.', failureText(error, 'Coba lagi.'))
    }
  }

  return (
    <section className="dash-page">
      <PageHeader section="Kelola User" detail={`${when} · ${session?.name ?? ''}`} />

      <Card title="Daftar user" className="product-card">
        <div className="product-tools">
          <TextField
            label="Cari"
            name="user-search"
            value={query}
            placeholder="Cari nama / email"
            onChange={(event) => setQuery(event.target.value)}
          />
          <SelectField
            label="Filter"
            name="user-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
          >
            {statusFilters.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </SelectField>
          <Button onClick={() => navigate('/pengguna/tambah')}>Tambah user</Button>
        </div>

        <Table caption="Daftar user">
          <TableHeader>
            <TableHeaderCell className="product-check" />
            <TableHeaderCell>Nama</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Peran</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Dibuat</TableHeaderCell>
          </TableHeader>
          <TableBody>
            {visible.map((account) => {
              const mine = account.email.toLowerCase() === session?.email.toLowerCase()
              return (
                <TableRow key={account.email}>
                  <TableCell className="product-check">
                    <Checkbox
                      hideLabel
                      label={`Pilih ${account.name}`}
                      name={`pick-user-${account.email}`}
                      checked={selectedEmail === account.email}
                      onChange={(event) => setSelectedEmail(event.target.checked ? account.email : null)}
                    />
                  </TableCell>
                  <TableCell>{displayName(account, mine)}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{roleTitle[account.role]}</TableCell>
                  <TableCell>
                    <Text as="span" className={account.active ? 'user-status-on' : 'user-status-off'}>
                      {statusLabel(account.active)}
                    </Text>
                  </TableCell>
                  <TableCell>{account.createdAt}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          <TableFooter
            colSpan={6}
            start={`Menampilkan ${visible.length} dari ${visible.length} user`}
            end={`${visible.length === 0 ? 0 : 1} dari 1`}
          />
        </Table>

        {selected && selectedMine ? (
          <div className="user-self-actions">
            <div className="user-self-copy">
              <Text>{displayName(selected, true)}</Text>
              <Text className="user-self-note">{selfDisableNote}</Text>
            </div>
            <Button variant="secondary" disabled>
              Nonaktifkan
            </Button>
          </div>
        ) : null}

        {selected && !selectedMine ? (
          <div className="user-row-actions">
            <Text className="user-row-name">{selected.name}</Text>
            <Button variant="secondary" onClick={() => setDialog({ kind: 'reset', account: selected })}>
              Reset kata sandi
            </Button>
            {selected.active ? (
              <Button variant="secondary" onClick={() => setDialog({ kind: 'off', account: selected })}>
                Nonaktifkan
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => setDialog({ kind: 'on', account: selected })}>
                Aktifkan
              </Button>
            )}
          </div>
        ) : null}
      </Card>

      {dialog?.kind === 'reset' ? (
        <Dialog
          title="Reset kata sandi?"
          body={`${dialog.account.name} · ${dialog.account.email}`}
          note="Kata sandi lama tidak dapat digunakan setelah reset. Kata sandi baru ditampilkan satu kali."
          cancelLabel="Batal"
          confirmLabel="Reset kata sandi"
          onCancel={() => setDialog(null)}
          onConfirm={() => void confirmReset()}
        />
      ) : null}

      {dialog?.kind === 'off' ? (
        <Dialog
          title="Nonaktifkan user?"
          body={`${dialog.account.name} · ${dialog.account.email}`}
          note="User nonaktif tidak dapat masuk. Akun Admin Anda tetap aktif."
          cancelLabel="Batal"
          confirmLabel="Nonaktifkan user"
          onCancel={() => setDialog(null)}
          onConfirm={() => void confirmActive(false)}
        />
      ) : null}

      {dialog?.kind === 'on' ? (
        <Dialog
          title="Aktifkan user?"
          body={`${dialog.account.name} · ${dialog.account.email}`}
          note="User dapat masuk kembali setelah diaktifkan."
          cancelLabel="Batal"
          confirmLabel="Aktifkan user"
          onCancel={() => setDialog(null)}
          onConfirm={() => void confirmActive(true)}
        />
      ) : null}
    </section>
  )
}
