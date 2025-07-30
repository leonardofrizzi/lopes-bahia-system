// src/app/api/users/route.ts
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // pega o Authorization que o cliente enviou
  const authHeader = request.headers.get('authorization') || ''

  try {
    // a URL do seu backend (defina NEXT_PUBLIC_API_BASE_URL no .env.local)
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

    // repassa a chamada ao endpoint protegido do backend
    const apiRes = await fetch(`${API_URL}/auth/users`, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
        Accept: 'application/json',
      },
    })

    const data = await apiRes.json()

    // devolve exatamente o mesmo status e JSON do backend
    return NextResponse.json(data, { status: apiRes.status })
  } catch (err) {
    console.error('Proxy /api/users error:', err)
    return NextResponse.json(
      { error: 'Erro interno ao buscar usuários' },
      { status: 500 }
    )
  }
}