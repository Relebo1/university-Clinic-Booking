export const dynamic = "force-dynamic"; // Ensure dynamic request handling

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, studentId, department, title, shift, year, phone, license } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user into database
    const [result] = await db.query(
      `INSERT INTO users 
       (name, email, password_hash, role, student_id, department, title, shift, year, phone, license)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, 
        email, 
        password_hash, 
        role, 
        studentId || null, 
        department || null, 
        title || null, 
        shift || null, 
        year || null, 
        phone || null, 
        license || null
      ]
    );

    // Return the auto-incremented ID of the new user
    const insertedId = (result as any).insertId;

    return NextResponse.json({ message: 'User registered successfully', userId: insertedId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
