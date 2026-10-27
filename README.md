# Hello Stock

React 19 + Vite, dengan fake server sebagai sumber data.

## Jalankan

```bash
npm install
npm run dev
```

- Aplikasi: http://localhost:5173
- Fake server: http://localhost:4000

`npm run dev` menjalankan keduanya. Perubahan di `server/` ikut reload.

## Struktur

Pendekatan utamanya feature/domain. Satu fitur menyimpan tipe, pemanggilan API, dan UI-nya sendiri. Komponen UI kecil yang dipakai ulang (atom) tinggal di `shared/ui`.

```text
server/                     fake REST API
  data/db.json              data awal
  index.js
src/
  app/                      shell aplikasi
  features/stock/           domain stok
    api/                    panggilan endpoint
    model/                  tipe data
    ui/                     tampilan fitur
  shared/
    api/                    HTTP client
    lib/                    formatter
    ui/atoms/               Heading, Text, Button, field
    ui/molecules/           Card, Table, Dialog, Panel
    ui/layout/              kerangka halaman
  styles/
```

Fitur berikutnya ditambah sebagai folder baru di `src/features/<nama>`, lalu dipasang dari `src/app`.

## Fake server

Data berubah hanya di memori. Restart server, atau tombol **Reset data awal**, mengembalikan `server/data/db.json`.

| Method | Path | Fungsi |
| --- | --- | --- |
| GET | `/api/health` | cek server |
| GET | `/api/stocks` | daftar stok |
| POST | `/api/stocks` | tambah barang |
| GET | `/api/stocks/:id` | detail |
| PATCH | `/api/stocks/:id` | ubah |
| DELETE | `/api/stocks/:id` | hapus |
| POST | `/api/stocks/reset` | kembalikan data awal |

Frontend memanggil `/api/...`. Vite meneruskannya ke port 4000.

## Cara pakai komponen

Halaman hanya merangkai komponen yang sudah ada. Judul, kalimat, tombol, dan field tidak ditulis sebagai tag HTML sendiri.

Import selalu menyertakan akhiran file.

```tsx
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Heading } from '@/shared/ui/atoms/Heading.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
```

### Atom

Potongan terkecil. Dipakai berulang di login, dashboard, dan tabel.

**Heading** — judul. `level` 1, 2, atau 3. Default 1.

```tsx
<Heading>Masuk ke akun Anda</Heading>
<Heading level={2}>Ringkasan stok</Heading>
<Heading level={3}>Hello Stock</Heading>
```

**Text** — kalimat. `as` berisi `p` (default) atau `span`.

```tsx
<Text>Selamat datang kembali.</Text>
<Text as="span" className="side-label">Dashboard</Text>
```

**TextLink** — tautan di dalam kalimat. `to` adalah path router.

```tsx
<Text>
  Belum punya akun? <TextLink to="/register">Daftar</TextLink>
</Text>
```

**Button** — semua tombol. `variant` berisi `primary` (default), `secondary`, atau `soft`. `size` berisi `md` atau `lg`. `block` membuat tombol selebar induknya. Prop tombol biasa (`type`, `onClick`, `disabled`) tetap dipakai.

```tsx
<Button type="submit" block>Masuk</Button>
<Button variant="secondary" disabled={!selected} onClick={askDelete}>Hapus</Button>
```

**TextField** — input satu baris. `label` wajib. `hideLabel` menyembunyikan label secara visual. `leading` dan `trailing` untuk ikon atau tombol di dalam field. `size` berisi `md` atau `lg`. Prop input lain (`value`, `onChange`, `placeholder`, `type`) ikut.

```tsx
<TextField label="Email" name="email" type="email" value={email} onChange={onEmail} />
<TextField hideLabel label="Cari" name="q" placeholder="Cari" leading={<img src={icon} alt="" />} />
```

**PasswordField** ada di `src/features/auth/ui/PasswordField.tsx`. Ini `TextField` plus tombol Tampilkan.

```tsx
<PasswordField label="Kata sandi" name="password" value={password} autoComplete="current-password" onChange={setPassword} />
```

**Checkbox** — `label` wajib. `hideLabel` untuk kotak pilih di tabel. `size` berisi `md` atau `lg`.

```tsx
<Checkbox label="Ingat saya" name="remember" checked={remember} onChange={onRemember} />
<Checkbox hideLabel label={`Pilih ${item.name}`} name={`pick-${item.id}`} checked={picked} onChange={onPick} />
```

**SelectField** — `label` wajib. Pilihan ditulis sebagai `option` di dalamnya.

```tsx
<SelectField label="Filter" name="category" value={category} onChange={onCategory}>
  <option value="semua">Semua kategori</option>
  <option value="Pakaian">Pakaian</option>
</SelectField>
```

**Chip** — label kecil di pojok kartu. **Pill** — badge naik atau turun. `tone` berisi `up` atau `down`.

```tsx
<Chip>Hari ini</Chip>
<Pill tone="up">▲ 5 produk</Pill>
```

### Molekul

Gabungan atom. Halaman memanggil molekul ini, bukan menyusun judul dan tombol dari nol.

**Alert** — pesan gagal. `title` wajib. Isi di `children` boleh kosong.

```tsx
<Alert title="Email atau kata sandi tidak cocok.">Coba lagi atau hubungi admin toko.</Alert>
```

**PageHeader** — judul halaman di dalam aplikasi. `section` menjadi remah roti dan judul. `detail` opsional.

```tsx
<PageHeader section={dashboard.section} detail={dashboard.greetedAt} />
```

**Card** — kotak berjudul. `title` opsional.

```tsx
<Card title="Daftar produk">{children}</Card>
```

**Panel** — kartu dashboard. `title` jadi heading level 2. `meta` di bawah judul. `aside` di kanan judul.

```tsx
<Panel title="Ringkasan stok" meta="27 Okt 2026" aside={<Chip>Hari ini</Chip>}>
  <Metric label="Stok akhir" value="202" tone="up" note="▲ 5 produk" detail="5 produk" />
</Panel>
```

**Metric** — satu angka di dalam panel. `tone` berisi `up` atau `down`.

**Dialog** — satu dialog untuk konfirmasi. `confirmLabel`, `onCancel`, dan `onConfirm` wajib. `cancelLabel` boleh dikosongkan kalau hanya ada satu tombol. Escape dan klik latar memanggil `onCancel`.

```tsx
<Dialog
  title="Hapus produk?"
  body="Tindakan ini tidak dapat dibatalkan."
  detail="Kaos · HL-001 · 0 PCS"
  cancelLabel="Batal"
  confirmLabel="Hapus produk"
  onCancel={close}
  onConfirm={remove}
/>
```

**Table** — susun dari `Table`, `TableHeader`, `TableHeaderCell`, `TableBody`, `TableRow`, `TableCell`, dan `TableFooter`. `caption` tidak kelihatan, untuk pembaca layar. `colSpan` di footer menutup seluruh kolom.

```tsx
<Table caption="Daftar produk">
  <TableHeader>
    <TableHeaderCell>Nama</TableHeaderCell>
    <TableHeaderCell>Stok</TableHeaderCell>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.quantity}</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter colSpan={2} start="Menampilkan 1 dari 5 produk" end="1 dari 1" />
</Table>
```

**BarChart** dan **HistoryList** khusus dashboard. Keduanya menerima data yang sudah jadi dari `GET /api/dashboard`, bukan angka yang ditulis di halaman.

```tsx
<BarChart
  months={dashboard.performance.months}
  average={dashboard.performance.average}
  averageLabel={dashboard.performance.averageLabel}
  rangeLabel={dashboard.performance.range}
/>
<HistoryList items={dashboard.history.items} />
```

### Halaman baru

1. Buat folder `src/features/<nama>` dengan `api`, `model`, dan `ui`.
2. Ambil data lewat fake server, lalu oper ke komponen.
3. Judul halaman pakai `PageHeader`. Kotak pakai `Card` atau `Panel`. Aksi pakai `Button`. Kalimat pakai `Text`.
4. Pasang route di `src/app/App.tsx`.
