import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query(
      'SELECT id, name, shift FROM users WHERE role = ?',
      ['nurse']
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Failed to fetch nurses:', error);
    return NextResponse.json({ error: 'Failed to fetch nurses' }, { status: 500 });
  }
}
