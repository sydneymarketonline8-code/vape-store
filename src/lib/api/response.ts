import { NextResponse } from 'next/server'
import type { ZodError } from 'zod'

/** Consistent JSON responses for API route handlers. */

export function ok<T>(data: T, init?: { status?: number; headers?: HeadersInit }) {
  return NextResponse.json({ data }, { status: init?.status ?? 200, headers: init?.headers })
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

/** 400 with field-level details from a failed Zod parse. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function zodErr(error: ZodError<any>) {
  const fields: Record<string, string> = {}
  for (const issue of error.issues) {
    fields[issue.path.join('.') || '_'] = issue.message
  }
  return NextResponse.json({ error: 'Validation failed', fields }, { status: 422 })
}

export const unauthorized = () => err('Not signed in', 401)
export const forbidden = () => err('Forbidden', 403)
export const notFound = (what = 'Resource') => err(`${what} not found`, 404)
