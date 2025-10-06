import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [users] = await db.query(
      `SELECT 
        id, name, email, role, student_id as studentId, 
        department, title, shift, year, phone, license,
        created_at, updated_at
       FROM users WHERE id = ?`,
      [params.id]
    );
    
    const userArray = users as any[];
    if (userArray.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(userArray[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await req.json();
    
    // Build dynamic update query
    const allowedFields = ['name', 'email', 'role', 'department', 'title', 'shift', 'year', 'phone', 'license'];
    const setClauses: string[] = [];
    const values: any[] = [];
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        setClauses.push(`${field} = ?`);
        values.push(updates[field]);
      }
    });
    
    if (setClauses.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    values.push(params.id);
    
    const query = `
      UPDATE users 
      SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await db.query(query, values);
    
    // Fetch updated user
    const [updatedUsers] = await db.query(
      `SELECT 
        id, name, email, role, student_id as studentId, 
        department, title, shift, year, phone, license,
        created_at, updated_at
       FROM users WHERE id = ?`,
      [params.id]
    );
    
    const userArray = updatedUsers as any[];
    if (userArray.length === 0) {
      return NextResponse.json(
        { error: 'User not found after update' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(userArray[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First check if user exists
    const [existing] = await db.query(
      'SELECT id FROM users WHERE id = ?',
      [params.id]
    );
    
    if ((existing as any[]).length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Delete user
    await db.query('DELETE FROM users WHERE id = ?', [params.id]);
    
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}