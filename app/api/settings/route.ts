import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_SETTINGS } from '@/lib/dummy-data'; // create array similar to USERS/APPOINTMENTS

export async function GET() {
  return NextResponse.json(SYSTEM_SETTINGS);
}

export async function POST(req: NextRequest) {
  const newSetting = await req.json();
  SYSTEM_SETTINGS.push(newSetting);
  return NextResponse.json(newSetting, { status: 201 });
}
