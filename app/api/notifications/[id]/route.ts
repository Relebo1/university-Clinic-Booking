import { NextRequest, NextResponse } from 'next/server';
import { NOTIFICATIONS } from '@/lib/dummy-data';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const updates = await req.json();
  const index = NOTIFICATIONS.findIndex(n => n.id === params.id);
  if (index === -1) return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
  NOTIFICATIONS[index] = { ...NOTIFICATIONS[index], ...updates };
  return NextResponse.json(NOTIFICATIONS[index]);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const index = NOTIFICATIONS.findIndex(n => n.id === params.id);
  if (index === -1) return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
  const deleted = NOTIFICATIONS.splice(index, 1)[0];
  return NextResponse.json(deleted);
}
