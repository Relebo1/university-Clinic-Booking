import { NextRequest, NextResponse } from 'next/server';
import { APPOINTMENT_TYPES } from '@/lib/dummy-data';

export async function GET() {
  return NextResponse.json(APPOINTMENT_TYPES);
}

export async function POST(req: NextRequest) {
  const newType = await req.json();
  APPOINTMENT_TYPES.push(newType);
  return NextResponse.json(newType, { status: 201 });
}
