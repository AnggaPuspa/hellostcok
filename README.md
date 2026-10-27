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
    ui/atoms/               Button, TextField
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
