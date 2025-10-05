import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();

    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND role = ? LIMIT 1',
      [email, role]
    );

    const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Use the correct column for hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    // Exclude password_hash from returned user
    const { password_hash, ...safeUser } = user;

    return NextResponse.json({ user: safeUser, token }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
