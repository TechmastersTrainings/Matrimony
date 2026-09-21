import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/v1\/?$/, '') ||
  'http://localhost:8000/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authHeader) {
      headers['authorization'] = authHeader;
    }

    const backendUrl = `${BACKEND_API_URL}/create-order`;
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { message: error.message || 'Failed to proxy order creation' },
        detail: error.message || 'Failed to proxy order creation',
      },
      { status: 500 }
    );
  }
}
