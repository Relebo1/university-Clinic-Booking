import { NextResponse } from 'next/server';
import { ANALYTICS_DATA } from '@/lib/dummy-data';

export async function GET() {
  return NextResponse.json(ANALYTICS_DATA);
}
