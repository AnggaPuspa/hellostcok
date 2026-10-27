export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type ErrorBody = {
  message?: string
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  if (response.status === 204) {
    return undefined as T
  }

  const payload = (await response.json().catch(() => null)) as ErrorBody | T | null

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload && payload.message
        ? payload.message
        : 'Request gagal'
    throw new ApiError(message, response.status)
  }

  return payload as T
}
