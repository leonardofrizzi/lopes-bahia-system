export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const apiRes = await fetch(
      'https://api.contact2sale.com/integration/leads',
      {
        headers: {
          Authorization:
            'Bearer feaa65443e41cc41a39e3834e8bd36a12100d96095f5381883',
          Accept: 'application/json',
        },
      }
    )

    const data = await apiRes.json()
    return NextResponse.json(data, { status: apiRes.status })
  } catch (err) {
    console.error('Proxy /api/proxy/leads error:', err)
    return NextResponse.json(
      { error: 'Erro interno ao buscar leads' },
      { status: 500 }
    )
  }
}
