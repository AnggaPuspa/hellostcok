import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const port = Number(process.env.PORT ?? 4000)
const root = dirname(fileURLToPath(import.meta.url))
const seed = JSON.parse(readFileSync(join(root, 'data', 'db.json'), 'utf8'))

let stocks = structuredClone(seed.stocks)

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
      quantity: quantity.value,
      price: price.value,
      unit: String(input.unit ?? 'pcs').trim() || 'pcs',
    },
  }
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
        send(res, 409, { message: 'SKU sudah dipakai' })
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
        send(res, 200, { data: stocks[index] })
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
          send(res, 409, { message: 'SKU sudah dipakai' })
          return
        }
        stocks[index] = built.value
        send(res, 200, { data: built.value })
        return
      }
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
  console.log('  GET    /api/stocks')
  console.log('  POST   /api/stocks')
  console.log('  GET    /api/stocks/:id')
  console.log('  PATCH  /api/stocks/:id')
  console.log('  DELETE /api/stocks/:id')
  console.log('  POST   /api/stocks/reset')
})
