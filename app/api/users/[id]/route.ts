import { NextRequest, NextResponse } from 'next/server';
import { USERS } from '@/lib/dummy-data';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = USERS.find(u => u.id === params.id);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const updates = await req.json();
  const index = USERS.findIndex(u => u.id === params.id);
  if (index === -1) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  USERS[index] = { ...USERS[index], ...updates };
  return NextResponse.json(USERS[index]);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const index = USERS.findIndex(u => u.id === params.id);
  if (index === -1) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  const deleted = USERS.splice(index, 1)[0];
  return NextResponse.json(deleted);
}
