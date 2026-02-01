import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://admin-grameenkalyan.stitbd.app/api/video-galleries'
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'API Error' },
      { status: 500 }
    );
  }
}
