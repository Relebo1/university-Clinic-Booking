import { NextRequest, NextResponse } from 'next/server';
import { NOTIFICATIONS } from '@/lib/dummy-data';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  const data = userId ? NOTIFICATIONS.filter(n => n.userId === userId) : NOTIFICATIONS;
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const notification = await req.json();
  NOTIFICATIONS.push(notification);
  return NextResponse.json(notification, { status: 201 });
}
