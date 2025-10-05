import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyJwt } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyJwt(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [rows] = await db.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [payload.id]
    );

    const user = (rows as any[])[0];
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
