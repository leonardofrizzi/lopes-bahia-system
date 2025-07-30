// src/app/api/empreendimentos/[id]/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

async function handleProxy(request: NextRequest, id: string) {
  const method = request.method;
  const url    = `${API_URL}/empreendimentos/${id}`;
  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    ...(request.headers.get('authorization') 
      ? { Authorization: request.headers.get('authorization')! } 
      : {}),
  };

  let apiRes: Response;
  if (method === 'GET' || method === 'DELETE') {
    apiRes = await fetch(url, { method, headers });
  } else if (method === 'PATCH') {
    const body = await request.json();
    apiRes = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });
  } else {
    return NextResponse.json({ detail: 'Method not allowed' }, { status: 405 });
  }

  const text = await apiRes.text();
  try {
    return NextResponse.json(JSON.parse(text), { status: apiRes.status });
  } catch {
    return new NextResponse(text, {
      status: apiRes.status,
      headers: { 'Content-Type': apiRes.headers.get('content-type') || 'text/plain' },
    });
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return handleProxy(request, params.id);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  return handleProxy(request, params.id);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return handleProxy(request, params.id);
}