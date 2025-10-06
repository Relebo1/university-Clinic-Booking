import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Fetch all users from database
    const [users] = await db.query(`
      SELECT 
        id, name, email, role, student_id as studentId, 
        department, title, shift, year, phone, license,
        created_at, updated_at
      FROM users 
      ORDER BY created_at DESC
    `);
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users from database' },
      { status: 500 }
    );
  }
}

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
    const bcrypt = await import('bcryptjs');
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

    // Fetch the created user to return
    const [newUser] = await db.query(
      `SELECT 
        id, name, email, role, student_id as studentId, 
        department, title, shift, year, phone, license,
        created_at, updated_at
       FROM users WHERE id = ?`,
      [(result as any).insertId]
    );

    return NextResponse.json((newUser as any[])[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}