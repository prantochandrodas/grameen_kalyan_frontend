import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.LARAVEL_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/recommended-video-galleries`);

  const data = await res.json();
  return NextResponse.json(data);
}
