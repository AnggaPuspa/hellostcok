import { ApiError, api } from '@/shared/api/client.ts'

export type Role = 'admin' | 'pemilik' | 'petugas'

export type Session = {
  name: string
  email: string
  role: Role
}

export type AccountView = Session & {
  active: boolean
  createdAt: string
}

export type CreatedAccount = {
  account: AccountView
  password: string
}

export type DemoAccount = {
  role: Role
  name: string
}

const sessionKey = 'hello-stock-session'
const rememberKey = 'hello-stock-remember'

type Data<T> = { data: T }

function saveSession(session: Session) {
  localStorage.setItem(sessionKey, JSON.stringify(session))
  return session
}

export function getSession() {
  const raw = localStorage.getItem(sessionKey)
  if (!raw) return null
  return JSON.parse(raw) as Session
}

export function logout() {
  localStorage.removeItem(sessionKey)
}

export function rememberedEmail() {
  return localStorage.getItem(rememberKey) ?? ''
}

export function rememberEmail(email: string) {
  localStorage.setItem(rememberKey, email)
}

export async function login(email: string, password: string) {
  try {
    const result = await api<Data<Session>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    return saveSession(result.data)
  } catch {
    return null
  }
}

export async function loginAs(role: Role) {
  const result = await api<Data<Session>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ role }),
  })
  return saveSession(result.data)
}

export async function register(input: { name: string; email: string; password: string }) {
  try {
    const result = await api<Data<Session>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    saveSession(result.data)
    return null
  } catch (error) {
    return error instanceof ApiError ? error.message : 'Daftar gagal.'
  }
}

export function getDemos() {
  return api<Data<DemoAccount[]>>('/auth/demos').then((result) => result.data)
}

export function listAccounts() {
  return api<Data<AccountView[]>>('/users').then((result) => result.data)
}

export function createAccount(input: { name: string; email: string; role: Role; active: boolean }) {
  return api<Data<CreatedAccount>>('/users', {
    method: 'POST',
    body: JSON.stringify(input),
  }).then((result) => result.data)
}

export function resetAccountPassword(email: string) {
  return api<Data<CreatedAccount>>('/users/reset', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }).then((result) => result.data)
}

export function setAccountActive(email: string, active: boolean) {
  const current = getSession()
  if (current && current.email.toLowerCase() === email.toLowerCase() && !active) {
    return Promise.resolve(null)
  }
  return api<Data<AccountView>>('/users/active', {
    method: 'POST',
    body: JSON.stringify({ email, active }),
  }).then((result) => result.data)
}
