import { ApiError } from '@/shared/api/client.ts'

export function failureText(error: unknown, fallback: string) {
  if (error instanceof ApiError && error.message) return error.message
  return fallback
}
