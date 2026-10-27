export type Role = 'admin' | 'pemilik' | 'petugas'

export type Session = {
  name: string
  email: string
  role: Role
}

type Account = Session & {
  password: string
}

const accountsKey = 'hello-stock-accounts'
const sessionKey = 'hello-stock-session'

const seeds: Account[] = [
  { name: 'Admin', email: 'admin@hellostock.test', password: 'admin', role: 'admin' },
  { name: 'Pemilik', email: 'pemilik@hellostock.test', password: 'pemilik', role: 'pemilik' },
]

function readAccounts() {
  const raw = localStorage.getItem(accountsKey)
  if (!raw) {
    localStorage.setItem(accountsKey, JSON.stringify(seeds))
    return seeds
  }
  return JSON.parse(raw) as Account[]
}

export function getSession() {
  const raw = localStorage.getItem(sessionKey)
  if (!raw) return null
  return JSON.parse(raw) as Session
}

function saveSession(account: Account) {
  const session: Session = { name: account.name, email: account.email, role: account.role }
  localStorage.setItem(sessionKey, JSON.stringify(session))
  return session
}

export function login(email: string, password: string) {
  const account = readAccounts().find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
  )
  if (!account) return null
  return saveSession(account)
}

export function register(input: { name: string; email: string; password: string }) {
  const accounts = readAccounts()
  const email = input.email.trim()
  if (accounts.some((item) => item.email.toLowerCase() === email.toLowerCase())) {
    return 'Email sudah terdaftar.'
  }

  const account: Account = {
    name: input.name.trim(),
    email,
    password: input.password,
    role: 'petugas',
  }
  localStorage.setItem(accountsKey, JSON.stringify([...accounts, account]))
  saveSession(account)
  return null
}

export function logout() {
  localStorage.removeItem(sessionKey)
}
