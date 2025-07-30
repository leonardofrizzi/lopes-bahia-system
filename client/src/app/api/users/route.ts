// client/src/app/api/users/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  // recebe o header Authorization do cliente
  const authHeader = request.headers.get('authorization') || '';

  // encaminha para o backend
  const apiRes = await fetch(`${API_URL}/auth/users`, {
    method: 'GET',
    headers: {
      Authorization: authHeader,
      Accept: 'application/json',
    },
  });

  const data = await apiRes.json();
  return NextResponse.json(data, { status: apiRes.status });
}