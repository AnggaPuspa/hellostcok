import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const port = Number(process.env.PORT ?? 4000)
const root = dirname(fileURLToPath(import.meta.url))
const seed = JSON.parse(readFileSync(join(root, 'data', 'db.json'), 'utf8'))

let stocks = structuredClone(seed.stocks)
let users = structuredClone(seed.users)
let movements = structuredClone(seed.movements)

function send(res, status, body) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (body === undefined) {
    res.writeHead(status, headers)
    res.end()
    return
  }

  res.writeHead(status, {
    ...headers,
    'Content-Type': 'application/json; charset=utf-8',
  })
  res.end(JSON.stringify(body))
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8').trim()
      if (!raw) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(raw))
      } catch {
        reject(new Error('JSON tidak valid'))
      }
    })
    req.on('error', reject)
  })
}

function requiredText(value, label) {
  const text = String(value ?? '').trim()
  if (!text) return { error: `${label} wajib diisi` }
  return { value: text }
}

function nonNegativeNumber(value, label) {
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0) {
    return { error: `${label} harus angka 0 atau lebih` }
  }
  return { value: number }
}

function buildStock(input, id) {
  const sku = requiredText(input.sku, 'SKU')
  if (sku.error) return { ok: false, message: sku.error }
  const name = requiredText(input.name, 'Nama')
  if (name.error) return { ok: false, message: name.error }
  const quantity = nonNegativeNumber(input.quantity ?? 0, 'Jumlah')
  if (quantity.error) return { ok: false, message: quantity.error }
  const price = nonNegativeNumber(input.price ?? 0, 'Harga')
  if (price.error) return { ok: false, message: price.error }

  return {
    ok: true,
    value: {
      id,
      sku: sku.value,
      name: name.value,
      category: String(input.category ?? 'Umum').trim() || 'Umum',
      location: String(input.location ?? '').trim(),
      quantity: quantity.value,
      price: price.value,
      unit: String(input.unit ?? 'pcs').trim() || 'pcs',
      photoName: input.photoName ? String(input.photoName) : null,
      photoUploadedAt: input.photoUploadedAt ? String(input.photoUploadedAt) : null,
      photoData: input.photoData ? String(input.photoData) : null,
    },
  }
}

function examplePassword(kind) {
  const stamp = String(Date.now()).slice(-2)
  return kind === 'reset' ? `Contoh-Reset-${stamp}!` : `Contoh-HS-${stamp}!`
}

function publicUser(user) {
  const createdAt = user.createdAt || '2026-10-04T09:00:00+08:00'
  return {
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active !== false,
    createdAt: formatWhen(createdAt, true),
  }
}

function sessionOf(user) {
  return { name: user.name, email: user.email, role: user.role }
}

function findUser(email) {
  return users.find((user) => user.email.toLowerCase() === String(email ?? '').trim().toLowerCase())
}

function formatWhen(value, withTime) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(new Date(value))
}

function formatPercent(value) {
  return `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(value)}%`
}

function signed(quantity) {
  return `${quantity > 0 ? '+' : ''}${quantity}`
}

function buildDashboard() {
  const now = new Date()
  const total = stocks.reduce((sum, item) => sum + item.quantity, 0)
  const byType = (type) => movements.filter((item) => item.type === type)
  const sumType = (type) => byType(type).reduce((sum, item) => sum + item.quantity, 0)
  const latest = (type) => byType(type)[0]
  const months = seed.performance.months
  const average = months.reduce((sum, item) => sum + item.value, 0) / months.length
  const averageLabel = `Rata-rata ${formatPercent(average)}`

  const metric = (label, quantity, movement) => ({
    label,
    value: signed(quantity),
    tone: quantity < 0 ? 'down' : 'up',
    note: movement ? `${quantity < 0 ? '▼' : '▲'} ${signed(quantity)}` : signed(quantity),
    detail: movement ? movement.name : '',
  })

  return {
    section: 'Dashboard',
    greetedAt: formatWhen(now, true),
    summary: {
      title: 'Ringkasan stok',
      meta: formatWhen(now, false),
      chip: 'Hari ini',
      metrics: [
        {
          label: 'Stok akhir',
          value: new Intl.NumberFormat('id-ID').format(total),
          tone: 'up',
          note: `▲ ${stocks.length} produk`,
          detail: `${stocks.length} produk`,
        },
        metric('Penerimaan', sumType('penerimaan'), latest('penerimaan')),
        metric('Penjualan', sumType('penjualan'), latest('penjualan')),
        metric('Koreksi opname', sumType('opname'), latest('opname')),
      ],
    },
    performance: {
      title: 'Performance',
      range: seed.performance.range,
      average,
      averageLabel,
      score: formatPercent(average),
      scoreLabel: 'Rata-rata',
      months,
    },
    history: {
      title: 'History',
      meta: movements[0] ? `Riwayat terbaru ${movements[0].name}` : 'Riwayat',
      items: movements.map((item) => ({
        title: item.type[0].toUpperCase() + item.type.slice(1),
        delta: signed(item.quantity),
        tone: item.quantity < 0 ? 'down' : 'up',
        time: formatWhen(item.at, true),
        amount: `${Math.abs(item.quantity)} ${item.unit}`,
      })),
    },
  }
}

function sameKey(left, right) {
  return String(left || '').trim().toLowerCase() === String(right || '').trim().toLowerCase()
}

function stockForMovement(item) {
  if (item.sku) {
    const bySku = stocks.find((stock) => sameKey(stock.sku, item.sku))
    if (bySku) return bySku
  }
  return stocks.find((stock) => stock.name === item.name) || null
}

function findStockByScan(raw) {
  const key = String(raw || '').trim()
  if (!key) return null
  const direct = stocks.find((stock) => sameKey(stock.sku, key) || sameKey(stock.id, key))
  if (direct) return direct
  const movement = movements.find((item) => sameKey(item.id, key) || sameKey(item.code, key))
  return movement ? stockForMovement(movement) : null
}

function stockHistory(stock) {
  return movements
    .filter((item) => (item.sku ? sameKey(item.sku, stock.sku) : item.name === stock.name))
    .map((item) => ({
      code: item.code || item.id.toUpperCase(),
      at: formatWhen(item.at, true),
      change: `${item.quantity > 0 ? '+' : ''}${item.quantity} ${String(item.unit).toUpperCase()}`,
      condition: item.condition || (item.type === 'rusak' ? 'Rusak' : 'Baik'),
    }))
}

function receiptView(item) {
  return {
    id: item.id,
    code: item.code || item.id.toUpperCase(),
    name: item.name,
    sku: item.sku || '',
    quantity: Math.abs(item.quantity),
    unit: item.unit,
    condition: item.condition || (item.type === 'rusak' ? 'Rusak' : 'Baik'),
    photoName: item.photoName || null,
    at: formatWhen(item.at, true),
  }
}

function dispositionLabel(value) {
  if (value === 'Tahan') return 'Ditahan · saat ini'
  return value || 'Musnah'
}

function damageView(item) {
  const disposition = item.disposition || (item.quantity < 0 ? 'Musnah' : 'Tahan')
  return {
    id: item.id,
    code: item.code || item.id.toUpperCase(),
    name: item.name,
    sku: item.sku || '',
    quantity: item.count ?? Math.abs(item.quantity),
    unit: item.unit,
    disposition,
    dispositionLabel: dispositionLabel(disposition),
    note: item.note || '',
    photoName: item.photoName || null,
    at: formatWhen(item.at, true),
  }
}

function opnameView(item) {
  const stock = stockForMovement(item)
  const after = item.after ?? (stock ? stock.quantity : 0)
  const before = item.before ?? after - item.quantity
  return {
    id: item.id,
    code: item.code || item.id.toUpperCase(),
    name: item.name,
    sku: item.sku || (stock ? stock.sku : ''),
    location: stock ? stock.location : item.location || '',
    before,
    after,
    change: item.quantity,
    unit: item.unit,
    reason: item.reason || '',
    at: formatWhen(item.at, true),
  }
}

const PHOTO_RETENTION_DAYS = 90

function startOfDay(value) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

function endOfDay(value) {
  const date = new Date(value)
  date.setHours(23, 59, 59, 999)
  return date
}

function reportRange(params) {
  const range = params.get('range') || 'today'
  const now = new Date()
  if (range === '7d') {
    const from = startOfDay(now)
    from.setDate(from.getDate() - 6)
    return { id: '7d', label: '7 hari', from, to: endOfDay(now) }
  }
  if (range === '30d') {
    const from = startOfDay(now)
    from.setDate(from.getDate() - 29)
    return { id: '30d', label: '30 hari', from, to: endOfDay(now) }
  }
  if (range === 'custom') {
    const from = startOfDay(params.get('from') || now)
    const to = endOfDay(params.get('to') || now)
    return {
      id: 'custom',
      label: `${formatWhen(from, false)} – ${formatWhen(to, false)}`,
      from,
      to,
    }
  }
  return { id: 'today', label: formatWhen(now, false), from: startOfDay(now), to: endOfDay(now) }
}

function inRange(at, range) {
  const time = new Date(at).getTime()
  return time >= range.from.getTime() && time <= range.to.getTime()
}

function qtyLabel(value, unit) {
  return `${value} ${String(unit).toUpperCase()}`
}

function photoStatus(item) {
  if (!item.photoName) return 'missing'
  const age = Date.now() - new Date(item.at).getTime()
  if (age > PHOTO_RETENTION_DAYS * 24 * 60 * 60 * 1000) return 'expired'
  return 'ready'
}

function buildReport(params) {
  const range = reportRange(params)
  const skuFilter = String(params.get('sku') || '').trim()
  const rows = stocks
    .filter((stock) => !skuFilter || sameKey(stock.sku, skuFilter))
    .map((stock) => {
      const periodMoves = movements.filter((item) => {
        const match = item.sku ? sameKey(item.sku, stock.sku) : item.name === stock.name
        return match && inRange(item.at, range)
      })
      const incoming = periodMoves
        .filter((item) => item.type === 'penerimaan')
        .reduce((sum, item) => sum + Math.abs(item.quantity), 0)
      const outgoing = periodMoves
        .filter((item) => item.type === 'penjualan')
        .reduce((sum, item) => sum + Math.abs(item.quantity), 0)
      const adjust = periodMoves
        .filter((item) => item.type === 'opname')
        .reduce((sum, item) => sum + item.quantity, 0)
      const damage = periodMoves
        .filter((item) => item.type === 'rusak' && item.quantity < 0)
        .reduce((sum, item) => sum + Math.abs(item.quantity), 0)
      const net = periodMoves.reduce((sum, item) => sum + item.quantity, 0)
      const closing = stock.quantity
      const opening = closing - net
      return {
        sku: stock.sku,
        name: stock.name,
        unit: stock.unit,
        opening,
        incoming,
        outgoing,
        adjust,
        damage,
        closing,
      }
    })
  return {
    range: range.id,
    periodLabel: range.label,
    summary: `Periode: ${range.label} · ${rows.length} produk`,
    data: rows,
  }
}

function movementCode(type, prefix) {
  const now = new Date()
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const count = movements.filter((item) => item.type === type).length + 1
  return `${prefix}-${stamp}-${String(count).padStart(3, '0')}`
}

function skuTaken(sku, ignoreId) {
  return stocks.some(
    (item) => item.id !== ignoreId && item.sku.toLowerCase() === sku.toLowerCase(),
  )
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const path = url.pathname.replace(/\/$/, '') || '/'
  const method = req.method ?? 'GET'

  if (method === 'OPTIONS') {
    send(res, 204)
    return
  }

  try {
    if (method === 'GET' && path === '/api/health') {
      send(res, 200, { ok: true, service: 'hello-stock-fake-server' })
      return
    }

    if (method === 'GET' && path === '/api/auth/demos') {
      send(res, 200, {
        data: users.filter((user) => user.demo && user.active !== false).map((user) => ({
          role: user.role,
          name: user.name,
        })),
      })
      return
    }

    if (method === 'POST' && path === '/api/auth/login') {
      const body = await readJson(req)
      const account = body.role
        ? users.find((user) => user.role === body.role && user.demo)
        : findUser(body.email)
      const passwordOk = body.role || account?.password === String(body.password ?? '')
      if (!account || account.active === false || !passwordOk) {
        send(res, 401, { message: 'Email atau kata sandi tidak cocok.' })
        return
      }
      send(res, 200, { data: sessionOf(account) })
      return
    }

    if (method === 'POST' && path === '/api/auth/register') {
      const body = await readJson(req)
      const name = requiredText(body.name, 'Nama')
      if (name.error) {
        send(res, 400, { message: name.error })
        return
      }
      const email = requiredText(body.email, 'Email')
      if (email.error) {
        send(res, 400, { message: email.error })
        return
      }
      const password = requiredText(body.password, 'Kata sandi')
      if (password.error) {
        send(res, 400, { message: password.error })
        return
      }
      if (findUser(email.value)) {
        send(res, 409, { message: 'Email sudah terdaftar.' })
        return
      }
      const account = {
        name: name.value,
        email: email.value,
        password: password.value,
        role: 'petugas',
        active: true,
        demo: false,
        createdAt: new Date().toISOString(),
      }
      users = [...users, account]
      send(res, 201, { data: sessionOf(account) })
      return
    }

    if (method === 'GET' && path === '/api/users') {
      send(res, 200, { data: users.map(publicUser) })
      return
    }

    if (method === 'POST' && path === '/api/users') {
      const body = await readJson(req)
      const name = requiredText(body.name, 'Nama')
      if (name.error) {
        send(res, 400, { message: name.error })
        return
      }
      const email = requiredText(body.email, 'Email')
      if (email.error) {
        send(res, 400, { message: email.error })
        return
      }
      if (findUser(email.value)) {
        send(res, 409, { message: 'Email sudah terdaftar.' })
        return
      }
      const role = ['admin', 'pemilik', 'petugas'].includes(body.role) ? body.role : 'petugas'
      const password = examplePassword('create')
      const account = {
        name: name.value,
        email: email.value,
        password,
        role,
        active: body.active !== false,
        demo: false,
        createdAt: new Date().toISOString(),
      }
      users = [...users, account]
      send(res, 201, { data: { account: publicUser(account), password } })
      return
    }

    if (method === 'POST' && path === '/api/users/reset') {
      const body = await readJson(req)
      const account = findUser(body.email)
      if (!account) {
        send(res, 404, { message: 'Pengguna tidak ditemukan' })
        return
      }
      account.password = examplePassword('reset')
      send(res, 200, { data: { account: publicUser(account), password: account.password } })
      return
    }

    if (method === 'POST' && path === '/api/users/active') {
      const body = await readJson(req)
      const account = findUser(body.email)
      if (!account) {
        send(res, 404, { message: 'Pengguna tidak ditemukan' })
        return
      }
      account.active = Boolean(body.active)
      send(res, 200, { data: publicUser(account) })
      return
    }

    if (method === 'GET' && path === '/api/dashboard') {
      send(res, 200, { data: buildDashboard() })
      return
    }

    if (method === 'GET' && path === '/api/receipts') {
      send(res, 200, { data: movements.filter((item) => item.type === 'penerimaan').map(receiptView) })
      return
    }

    if (method === 'POST' && path === '/api/receipts') {
      const body = await readJson(req)
      const sku = requiredText(body.sku, 'SKU')
      if (sku.error) {
        send(res, 400, { message: sku.error })
        return
      }
      const stock = stocks.find((item) => item.sku.toLowerCase() === sku.value.toLowerCase())
      if (!stock) {
        send(res, 404, { message: 'Produk tidak ditemukan. Pindai ulang atau minta Admin memeriksa label.' })
        return
      }
      const quantity = nonNegativeNumber(body.quantity, 'Jumlah')
      if (quantity.error || quantity.value < 1) {
        send(res, 400, { message: 'Jumlah harus angka 1 atau lebih' })
        return
      }
      const condition = body.condition === 'Rusak' ? 'Rusak' : 'Baik'
      if (condition === 'Baik') stock.quantity += quantity.value
      const item = {
        id: `mv-${crypto.randomUUID().slice(0, 8)}`,
        type: 'penerimaan',
        code: movementCode('penerimaan', 'IN'),
        name: stock.name,
        sku: stock.sku,
        quantity: quantity.value,
        unit: stock.unit,
        condition,
        photoName: body.photoName ? String(body.photoName) : null,
        at: new Date().toISOString(),
      }
      movements = [item, ...movements]
      send(res, 201, { data: receiptView(item) })
      return
    }

    const receiptMatch = path.match(/^\/api\/receipts\/([^/]+)$/)
    if (receiptMatch && (method === 'GET' || method === 'PATCH')) {
      const item = movements.find((entry) => entry.id === decodeURIComponent(receiptMatch[1]) && entry.type === 'penerimaan')
      if (!item) {
        send(res, 404, { message: 'Penerimaan tidak ditemukan' })
        return
      }
      if (method === 'PATCH') {
        const body = await readJson(req)
        if (body.photoName) item.photoName = String(body.photoName)
        send(res, 200, { data: receiptView(item) })
        return
      }
      send(res, 200, { data: receiptView(item) })
      return
    }

    if (method === 'GET' && path === '/api/sales') {
      send(res, 200, { data: movements.filter((item) => item.type === 'penjualan').map(receiptView) })
      return
    }

    if (method === 'POST' && path === '/api/sales') {
      const body = await readJson(req)
      const sku = requiredText(body.sku, 'SKU')
      if (sku.error) {
        send(res, 400, { message: sku.error })
        return
      }
      const stock = stocks.find((item) => item.sku.toLowerCase() === sku.value.toLowerCase())
      if (!stock) {
        send(res, 404, { message: 'Produk tidak ditemukan. Pindai ulang atau minta Admin memeriksa label.' })
        return
      }
      const quantity = nonNegativeNumber(body.quantity, 'Jumlah')
      if (quantity.error || quantity.value < 1) {
        send(res, 400, { message: 'Jumlah harus angka 1 atau lebih' })
        return
      }
      const label = String(stock.unit).toUpperCase()
      if (quantity.value > stock.quantity) {
        send(res, 409, {
          message: `Ditolak: jumlah melebihi stok tercatat · Permintaan ${quantity.value} ${label}, stok fisik tercatat ${stock.quantity} ${label}. Kurangi jumlah menjadi maksimal ${stock.quantity} ${label}. Stok tetap ${stock.quantity} ${label}.`,
        })
        return
      }
      stock.quantity -= quantity.value
      const item = {
        id: `mv-${crypto.randomUUID().slice(0, 8)}`,
        type: 'penjualan',
        code: movementCode('penjualan', 'OUT'),
        name: stock.name,
        sku: stock.sku,
        quantity: -quantity.value,
        unit: stock.unit,
        condition: body.condition === 'Rusak' ? 'Rusak' : 'Baik',
        photoName: body.photoName ? String(body.photoName) : null,
        at: new Date().toISOString(),
      }
      movements = [item, ...movements]
      send(res, 201, { data: receiptView(item) })
      return
    }

    const saleMatch = path.match(/^\/api\/sales\/([^/]+)$/)
    if (saleMatch && (method === 'GET' || method === 'PATCH')) {
      const item = movements.find((entry) => entry.id === decodeURIComponent(saleMatch[1]) && entry.type === 'penjualan')
      if (!item) {
        send(res, 404, { message: 'Penjualan tidak ditemukan' })
        return
      }
      if (method === 'PATCH') {
        const body = await readJson(req)
        if (body.photoName) item.photoName = String(body.photoName)
        send(res, 200, { data: receiptView(item) })
        return
      }
      send(res, 200, { data: receiptView(item) })
      return
    }

    if (method === 'GET' && path === '/api/damages') {
      send(res, 200, { data: movements.filter((item) => item.type === 'rusak').map(damageView) })
      return
    }

    if (method === 'POST' && path === '/api/damages') {
      const body = await readJson(req)
      const sku = requiredText(body.sku, 'Produk')
      if (sku.error) {
        send(res, 400, { message: sku.error })
        return
      }
      const note = requiredText(body.note, 'Catatan kerusakan')
      if (note.error) {
        send(res, 400, { message: note.error })
        return
      }
      if (!body.photoName) {
        send(res, 400, { message: 'Belum bisa disimpan: foto QC belum tersedia · Lengkapi foto QC sebelum menyimpan catatan kerusakan.' })
        return
      }
      const disposition = ['Tahan', 'Retur', 'Musnah'].includes(body.disposition) ? body.disposition : ''
      if (!disposition) {
        send(res, 400, { message: 'Disposisi harus Tahan, Retur, atau Musnah.' })
        return
      }
      const stock = stocks.find((item) => item.sku.toLowerCase() === sku.value.toLowerCase())
      if (!stock) {
        send(res, 404, { message: 'Produk tidak ditemukan.' })
        return
      }
      const quantity = nonNegativeNumber(body.quantity, 'Jumlah')
      if (quantity.error || quantity.value < 1) {
        send(res, 400, { message: 'Jumlah harus angka 1 atau lebih' })
        return
      }
      if (disposition === 'Musnah' && quantity.value > stock.quantity) {
        send(res, 409, { message: `Jumlah melebihi stok tercatat ${stock.quantity} ${String(stock.unit).toUpperCase()}.` })
        return
      }
      if (disposition === 'Musnah') stock.quantity -= quantity.value
      const item = {
        id: `mv-${crypto.randomUUID().slice(0, 8)}`,
        type: 'rusak',
        code: movementCode('rusak', 'DAM'),
        name: stock.name,
        sku: stock.sku,
        quantity: disposition === 'Musnah' ? -quantity.value : 0,
        count: quantity.value,
        unit: stock.unit,
        disposition,
        note: note.value,
        photoName: String(body.photoName),
        at: new Date().toISOString(),
      }
      movements = [item, ...movements]
      send(res, 201, { data: damageView(item), stock: stock.quantity })
      return
    }

    const damageMatch = path.match(/^\/api\/damages\/([^/]+)$/)
    if (damageMatch && (method === 'GET' || method === 'PATCH')) {
      const item = movements.find((entry) => entry.id === decodeURIComponent(damageMatch[1]) && entry.type === 'rusak')
      if (!item) {
        send(res, 404, { message: 'Barang rusak tidak ditemukan' })
        return
      }
      const stock = stocks.find((entry) => entry.sku === item.sku) || stockForMovement(item)
      if (method === 'PATCH') {
        const body = await readJson(req)
        if (body.photoName) item.photoName = String(body.photoName)
        if (body.disposition) {
          const next = ['Tahan', 'Retur', 'Musnah'].includes(body.disposition) ? body.disposition : item.disposition
          const count = item.count ?? Math.abs(item.quantity)
          const wasDestroy = item.disposition === 'Musnah'
          const willDestroy = next === 'Musnah'
          if (stock && wasDestroy && !willDestroy) stock.quantity += count
          if (stock && !wasDestroy && willDestroy) {
            if (count > stock.quantity) {
              send(res, 409, { message: `Jumlah melebihi stok tercatat ${stock.quantity} ${String(stock.unit).toUpperCase()}.` })
              return
            }
            stock.quantity -= count
          }
          item.disposition = next
          item.count = count
          item.quantity = willDestroy ? -count : 0
        }
        send(res, 200, { data: damageView(item), stock: stock ? stock.quantity : 0 })
        return
      }
      send(res, 200, { data: damageView(item), stock: stock ? stock.quantity : 0 })
      return
    }

    if (method === 'GET' && path === '/api/opnames') {
      send(res, 200, {
        data: movements.filter((item) => item.type === 'opname').map((item) => opnameView(item)),
      })
      return
    }

    if (method === 'GET' && path.startsWith('/api/opnames/')) {
      const id = path.slice('/api/opnames/'.length)
      const item = movements.find((entry) => entry.id === id && entry.type === 'opname')
      if (!item) {
        send(res, 404, { message: 'Koreksi opname tidak ditemukan' })
        return
      }
      send(res, 200, { data: opnameView(item) })
      return
    }

    if (method === 'POST' && path === '/api/opnames') {
      const body = await readJson(req)
      const sku = requiredText(body.sku, 'SKU')
      if (sku.error) {
        send(res, 400, { message: sku.error })
        return
      }
      const stock = stocks.find((item) => item.sku.toLowerCase() === sku.value.toLowerCase())
      if (!stock) {
        send(res, 404, { message: 'Produk tidak ditemukan' })
        return
      }
      const counted = nonNegativeNumber(body.counted, 'Hitung fisik')
      if (counted.error) {
        send(res, 400, { message: counted.error })
        return
      }
      const reason = requiredText(body.reason, 'Alasan koreksi')
      if (reason.error) {
        send(res, 400, { message: 'Alasan koreksi wajib diisi.' })
        return
      }
      const before = stock.quantity
      const change = counted.value - before
      stock.quantity = counted.value
      const item = {
        id: `mv-${crypto.randomUUID().slice(0, 8)}`,
        type: 'opname',
        code: movementCode('opname', 'ADJ'),
        name: stock.name,
        sku: stock.sku,
        quantity: change,
        before,
        after: counted.value,
        unit: stock.unit,
        reason: reason.value,
        at: new Date().toISOString(),
      }
      movements = [item, ...movements]
      send(res, 201, { data: opnameView(item) })
      return
    }

    if (method === 'GET' && path === '/api/stocks/lookup') {
      const stock = findStockByScan(url.searchParams.get('code'))
      if (!stock) {
        send(res, 404, { message: 'Produk tidak ditemukan. Pindai ulang atau minta Admin memeriksa label.' })
        return
      }
      send(res, 200, { data: stock })
      return
    }

    if (method === 'GET' && path === '/api/stocks') {
      send(res, 200, { data: stocks })
      return
    }

    if (method === 'POST' && path === '/api/stocks/reset') {
      stocks = structuredClone(seed.stocks)
      send(res, 200, { data: stocks })
      return
    }

    if (method === 'POST' && path === '/api/stocks') {
      const body = await readJson(req)
      const built = buildStock(body, `stk-${crypto.randomUUID().slice(0, 8)}`)
      if (!built.ok) {
        send(res, 400, { message: built.message })
        return
      }
      if (skuTaken(built.value.sku)) {
        send(res, 409, { message: `SKU ${built.value.sku} sudah digunakan.` })
        return
      }
      stocks = [built.value, ...stocks]
      send(res, 201, { data: built.value })
      return
    }

    const match = path.match(/^\/api\/stocks\/([^/]+)$/)
    if (match) {
      const id = decodeURIComponent(match[1])
      const index = stocks.findIndex((item) => item.id === id)

      if (method === 'GET') {
        if (index === -1) {
          send(res, 404, { message: 'Stok tidak ditemukan' })
          return
        }
        send(res, 200, { data: stocks[index], history: stockHistory(stocks[index]) })
        return
      }

      if (method === 'DELETE') {
        if (index === -1) {
          send(res, 404, { message: 'Stok tidak ditemukan' })
          return
        }
        const [removed] = stocks.splice(index, 1)
        send(res, 200, { data: removed })
        return
      }

      if (method === 'PATCH') {
        if (index === -1) {
          send(res, 404, { message: 'Stok tidak ditemukan' })
          return
        }
        const body = await readJson(req)
        const current = stocks[index]
        const built = buildStock({ ...current, ...body }, current.id)
        if (!built.ok) {
          send(res, 400, { message: built.message })
          return
        }
        if (skuTaken(built.value.sku, current.id)) {
          send(res, 409, { message: `SKU ${built.value.sku} sudah digunakan.` })
          return
        }
        stocks[index] = built.value
        send(res, 200, { data: built.value })
        return
      }
    }

    if (method === 'GET' && path === '/api/reports') {
      const report = buildReport(url.searchParams)
      send(res, 200, report)
      return
    }

    if (method === 'GET' && path === '/api/reports/export') {
      const report = buildReport(url.searchParams)
      const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const lines = [
        'Produk,SKU,Awal,Penerimaan,Penjualan,Koreksi,Kerusakan,Akhir,Unit',
        ...report.data.map(
          (row) =>
            `"${row.name}",${row.sku},${row.opening},${row.incoming},${row.outgoing},${row.adjust},${row.damage},${row.closing},${row.unit}`,
        ),
      ]
      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="laporan-stok-${stamp}.csv"`,
        'Access-Control-Allow-Origin': '*',
      })
      res.end(`\uFEFF${lines.join('\n')}`)
      return
    }

    const reportDetail = path.match(/^\/api\/reports\/([^/]+)$/)
    if (method === 'GET' && reportDetail) {
      const sku = decodeURIComponent(reportDetail[1])
      const report = buildReport(url.searchParams)
      const row = report.data.find((item) => sameKey(item.sku, sku))
      if (!row) {
        send(res, 404, { message: 'Produk tidak ditemukan di laporan' })
        return
      }
      const stock = stocks.find((item) => sameKey(item.sku, sku))
      const range = reportRange(url.searchParams)
      const txs = movements
        .filter((item) => {
          const match = item.sku ? sameKey(item.sku, sku) : stock && item.name === stock.name
          return match && inRange(item.at, range)
        })
        .slice()
        .sort((a, b) => new Date(a.at) - new Date(b.at))
      let running = row.opening
      const transactions = txs.map((item) => {
        running += item.quantity
        const mark =
          item.type === 'penerimaan'
            ? 'IN'
            : item.type === 'penjualan'
              ? 'OUT'
              : item.type === 'opname'
                ? 'ADJ'
                : 'DAMAGE'
        const signedQty =
          item.quantity === 0
            ? `0 ${String(item.unit).toUpperCase()}`
            : `${item.quantity > 0 ? '+' : '−'}${Math.abs(item.quantity)} ${String(item.unit).toUpperCase()}`
        return {
          id: item.id,
          code: item.code || item.id.toUpperCase(),
          at: formatWhen(item.at, true),
          mark: `${mark} · ${signedQty}`,
          after: `${running} ${String(item.unit).toUpperCase()}`,
          photoName: item.photoName || null,
          photoStatus: photoStatus(item),
          type: item.type,
        }
      })
      const photo = transactions.find((item) => item.photoName || item.photoStatus === 'expired') || null
      send(res, 200, {
        data: {
          ...row,
          category: stock ? stock.category : '',
          location: stock ? stock.location : '',
          periodLabel: report.periodLabel,
          periodNote: `${report.periodLabel} · Awal ${qtyLabel(row.opening, row.unit)} · Akhir ${qtyLabel(row.closing, row.unit)}`,
          damageNote: `Kerusakan toko (−DAMAGE): ${qtyLabel(row.damage, row.unit)} · Catatan Tahan tidak mengurangi stok.`,
          transactions,
          photo: photo
            ? {
                code: photo.code,
                status: photo.photoStatus,
                name: photo.photoName,
              }
            : null,
        },
      })
      return
    }

    send(res, 404, { message: 'Route tidak ditemukan' })
  } catch (error) {
    send(res, 400, {
      message: error instanceof Error ? error.message : 'Request gagal',
    })
  }
})

server.listen(port, () => {
  console.log(`Fake server Hello Stock: http://localhost:${port}`)
  console.log('  GET    /api/health')
  console.log('  POST   /api/auth/login')
  console.log('  POST   /api/auth/register')
  console.log('  GET    /api/dashboard')
  console.log('  GET    /api/stocks')
  console.log('  POST   /api/stocks')
  console.log('  GET    /api/stocks/:id')
  console.log('  PATCH  /api/stocks/:id')
  console.log('  DELETE /api/stocks/:id')
  console.log('  POST   /api/stocks/reset')
  console.log('  GET    /api/reports')
  console.log('  GET    /api/reports/export')
  console.log('  GET    /api/reports/:sku')
})
