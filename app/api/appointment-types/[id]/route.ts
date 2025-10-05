import { NextRequest, NextResponse } from 'next/server';
import { APPOINTMENT_TYPES } from '@/lib/dummy-data';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const updates = await req.json();
  const index = APPOINTMENT_TYPES.findIndex(t => t.value === params.id);
  if (index === -1) return NextResponse.json({ error: 'Type not found' }, { status: 404 });
  APPOINTMENT_TYPES[index] = { ...APPOINTMENT_TYPES[index], ...updates };
  return NextResponse.json(APPOINTMENT_TYPES[index]);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const index = APPOINTMENT_TYPES.findIndex(t => t.value === params.id);
  if (index === -1) return NextResponse.json({ error: 'Type not found' }, { status: 404 });
  const deleted = APPOINTMENT_TYPES.splice(index, 1)[0];
  return NextResponse.json(deleted);
}
