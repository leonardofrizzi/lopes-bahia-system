// src/app/api/auth/register/route.ts
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
  const authHeader = request.headers.get('authorization') || ''
  const body = await request.json()

  try {
    const apiRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await apiRes.json()
    return NextResponse.json(data, { status: apiRes.status })
  } catch (err) {
    console.error('Proxy /api/auth/register error:', err)
    return NextResponse.json(
      { detail: 'Erro interno ao registrar usuário' },
      { status: 500 }
    )
  }
}