// src/app/api/users/[cpf]/route.ts
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

/**
 * GET /api/users/[cpf]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { cpf: string } }
) {
  const { cpf } = params
  const authHeader = request.headers.get('authorization') || ''
  const apiRes = await fetch(`${API_URL}/auth/users/${cpf}`, {
    headers: { Authorization: authHeader },
  })
  const data = await apiRes.json()
  return NextResponse.json(data, { status: apiRes.status })
}

/**
 * PATCH /api/users/[cpf]
 * (vamos usar PATCH para atualização parcial)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { cpf: string } }
) {
  const { cpf } = params
  const authHeader = request.headers.get('authorization') || ''
  const body = await request.json()

  const apiRes = await fetch(`${API_URL}/auth/users/${cpf}`, {
    method: 'PATCH',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await apiRes.json()
  return NextResponse.json(data, { status: apiRes.status })
}

/**
 * DELETE /api/users/[cpf]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { cpf: string } }
) {
  const { cpf } = params
  const authHeader = request.headers.get('authorization') || ''
  const apiRes = await fetch(`${API_URL}/auth/users/${cpf}`, {
    method: 'DELETE',
    headers: { Authorization: authHeader },
  })
  if (!apiRes.ok) {
    const err = await apiRes.json()
    return NextResponse.json(err, { status: apiRes.status })
  }
  // 204 No Content
  return new NextResponse(null, { status: 204 })
}