import { NextRequest, NextResponse } from 'next/server';
import { USERS } from '@/lib/dummy-data';

export async function GET() {
  return NextResponse.json(USERS);
}

export async function POST(req: NextRequest) {
  const newUser = await req.json();
  USERS.push(newUser); // replace with DB insert later
  return NextResponse.json(newUser, { status: 201 });
}
