import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Fetch all users from database
    const [users] = await db.query(`
      SELECT 
        id, 
        name, 
        email, 
        role, 
        student_id as studentId, 
        department, 
        title, 
        shift, 
        year, 
        phone, 
        license,
        created_at, 
        updated_at
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
    const { name, email, password, role, studentId, department, title, shift, year, phone, license } = await req.json();

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const password_hash = await bcrypt.hash(password, 12);

    // Generate user ID based on role
    const userId = await generateUserId(role);

    // Insert user into database
    const [result] = await db.query(
      `INSERT INTO users 
       (id, name, email, password_hash, role, student_id, department, title, shift, year, phone, license)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
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

    // Fetch the created user to return (without password)
    const [newUser] = await db.query(
      `SELECT 
        id, 
        name, 
        email, 
        role, 
        student_id as studentId, 
        department, 
        title, 
        shift, 
        year, 
        phone, 
        license,
        created_at, 
        updated_at
       FROM users WHERE id = ?`,
      [userId]
    );

    return NextResponse.json((newUser as any[])[0], { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// Helper function to generate user IDs
async function generateUserId(role: string): Promise<string> {
  const prefixes: { [key: string]: string } = {
    student: 'STU',
    staff: 'STA', 
    nurse: 'NUR',
    administrator: 'ADM'
  };
  
  const prefix = prefixes[role] || 'USR';
  
  // Get the highest existing ID for this role
  const [existingIds] = await db.query(
    'SELECT id FROM users WHERE id LIKE ? ORDER BY id DESC LIMIT 1',
    [`${prefix}%`]
  );
  
  const existingArray = existingIds as any[];
  
  if (existingArray.length === 0) {
    return `${prefix}001`;
  }
  
  const lastId = existingArray[0].id;
  const lastNumber = parseInt(lastId.replace(prefix, '')) || 0;
  const nextNumber = (lastNumber + 1).toString().padStart(3, '0');
  
  return `${prefix}${nextNumber}`;
}