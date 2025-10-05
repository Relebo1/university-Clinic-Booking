import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_SETTINGS } from '@/lib/dummy-data';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const updates = await req.json();
  const index = SYSTEM_SETTINGS.findIndex(s => s.id === Number(params.id));
  if (index === -1) return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
  SYSTEM_SETTINGS[index] = { ...SYSTEM_SETTINGS[index], ...updates };
  return NextResponse.json(SYSTEM_SETTINGS[index]);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const index = SYSTEM_SETTINGS.findIndex(s => s.id === Number(params.id));
  if (index === -1) return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
  const deleted = SYSTEM_SETTINGS.splice(index, 1)[0];
  return NextResponse.json(deleted);
}
