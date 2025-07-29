export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const body = await request.json()

  try {
    const apiRes = await fetch(
      `https://api.contact2sale.com/integration/leads/${id}/mark_as_interacted`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer feaa65443e41cc41a39e3834e8bd36a12100d96095f5381883',
        },
        body: JSON.stringify(body),
      }
    )

    const data = await apiRes.json()
    return NextResponse.json(data, { status: apiRes.status })

  } catch (err) {
    console.error('Proxy POST mark_as_interacted error:', err)
    return NextResponse.json(
      { error: 'Erro interno ao registrar interação' },
      { status: 500 }
    )
  }
}