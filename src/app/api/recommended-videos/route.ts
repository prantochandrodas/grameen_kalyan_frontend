import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // 🔥 route dynamic

export async function GET() {
  const baseUrl = process.env.LARAVEL_PUBLIC_BASE_URL;

  const res = await fetch(
    `${baseUrl}/recommended-video-galleries`,
    {
      cache: 'no-store', // ❗ no cache
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}