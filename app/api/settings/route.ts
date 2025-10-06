import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Fetch all system settings from database
    const [settings] = await db.query(`
      SELECT 
        id,
        setting_key as key,
        setting_value as value,
        setting_type as type,
        description,
        updated_at
      FROM system_settings 
      ORDER BY setting_key
    `);
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system settings from database' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { key, value, type = 'string', description } = await req.json();

    // Validate required fields
    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['string', 'number', 'boolean', 'json'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Type must be one of: string, number, boolean, json' },
        { status: 400 }
      );
    }

    // Check if setting already exists
    const [existing] = await db.query(
      'SELECT id FROM system_settings WHERE setting_key = ?',
      [key]
    );
    
    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { error: 'System setting with this key already exists' },
        { status: 409 }
      );
    }

    // Insert new system setting into database
    const [result] = await db.query(
      `INSERT INTO system_settings 
       (setting_key, setting_value, setting_type, description)
       VALUES (?, ?, ?, ?)`,
      [key, value.toString(), type, description || null]
    );

    // Fetch the created setting to return
    const [newSetting] = await db.query(
      `SELECT 
        id,
        setting_key as key,
        setting_value as value,
        setting_type as type,
        description,
        updated_at
       FROM system_settings WHERE id = ?`,
      [(result as any).insertId]
    );

    return NextResponse.json((newSetting as any[])[0], { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create system setting' },
      { status: 500 }
    );
  }
}