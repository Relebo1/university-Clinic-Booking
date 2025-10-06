import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Fetch appointment types from database
    const [appointmentTypes] = await db.query(`
      SELECT 
        id,
        value,
        label,
        duration,
        description,
        active,
        created_at,
        updated_at
      FROM appointment_types 
      WHERE active = TRUE
      ORDER BY label
    `);
    
    return NextResponse.json(appointmentTypes);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment types from database' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { value, label, duration, description, active = true } = await req.json();

    // Validate required fields
    if (!value || !label || !duration) {
      return NextResponse.json(
        { error: 'Value, label, and duration are required' },
        { status: 400 }
      );
    }

    // Check if appointment type already exists
    const [existing] = await db.query(
      'SELECT id FROM appointment_types WHERE value = ?',
      [value]
    );
    
    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { error: 'Appointment type with this value already exists' },
        { status: 409 }
      );
    }

    // Insert new appointment type into database
    const [result] = await db.query(
      `INSERT INTO appointment_types 
       (value, label, duration, description, active)
       VALUES (?, ?, ?, ?, ?)`,
      [value, label, duration, description || null, active]
    );

    // Fetch the created appointment type to return
    const [newType] = await db.query(
      `SELECT 
        id,
        value,
        label,
        duration,
        description,
        active,
        created_at,
        updated_at
       FROM appointment_types WHERE id = ?`,
      [(result as any).insertId]
    );

    return NextResponse.json((newType as any[])[0], { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment type' },
      { status: 500 }
    );
  }
}