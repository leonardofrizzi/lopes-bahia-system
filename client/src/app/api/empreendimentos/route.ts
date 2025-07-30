// src/app/api/empreendimentos/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

async function handleProxy(request: NextRequest) {
  const { method } = request;
  // Atenção ao slash final
  const url = `${API_URL}/empreendimentos/`;
  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    // só repassa authorization se existir
    ...(request.headers.get('authorization')
      ? { Authorization: request.headers.get('authorization')! }
      : {}),
  };

  let apiRes: Response;
  if (method === 'GET') {
    apiRes = await fetch(url, { method: 'GET', headers });
  } else if (method === 'POST') {
    const body = await request.json();
    apiRes = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  } else {
    return NextResponse.json(
      { detail: 'Method not allowed' },
      { status: 405 }
    );
  }

  // lê o texto bruto
  const text = await apiRes.text();
  try {
    // tenta parsear como JSON
    const data = JSON.parse(text);
    return NextResponse.json(data, { status: apiRes.status });
  } catch {
    // se não for JSON válido, devolve como plain text
    return new NextResponse(text, {
      status: apiRes.status,
      headers: { 'Content-Type': apiRes.headers.get('content-type') || 'text/plain' },
    });
  }
}

// exporta GET e POST
export async function GET(request: NextRequest) {
  return handleProxy(request);
}

export async function POST(request: NextRequest) {
  return handleProxy(request);
}