// src/app/api/auth/login/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const apiRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)  // sem vírgula sobrando aqui
    });

    const text = await apiRes.text();
    // só tenta parsear JSON se for OK
    if (!apiRes.ok) {
      // devolve o texto bruto do backend como detail
      return NextResponse.json(
        { detail: text },
        { status: apiRes.status }
      );
    }

    // se OK, parse JSON de verdade
    const data = JSON.parse(text);
    return NextResponse.json(data, { status: apiRes.status });
  } catch (err) {
    console.error('Proxy /api/auth/login error:', err);
    return NextResponse.json(
      { detail: 'Erro interno no login' },
      { status: 500 }
    );
  }
}