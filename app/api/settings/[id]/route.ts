import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [settings] = await db.query(
      `SELECT 
        id,
        setting_key as key,
        setting_value as value,
        setting_type as type,
        description,
        updated_at
       FROM system_settings WHERE id = ?`,
      [params.id]
    );
    
    const settingArray = settings as any[];
    if (settingArray.length === 0) {
      return NextResponse.json(
        { error: 'System setting not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(settingArray[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system setting' },
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
    const allowedFields = ['key', 'value', 'type', 'description'];
    const setClauses: string[] = [];
    const values: any[] = [];
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        // Map frontend field names to database column names
        const dbField = field === 'key' ? 'setting_key' : 
                       field === 'value' ? 'setting_value' :
                       field === 'type' ? 'setting_type' : field;
        
        setClauses.push(`${dbField} = ?`);
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
      UPDATE system_settings 
      SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await db.query(query, values);
    
    // Fetch updated setting
    const [updatedSettings] = await db.query(
      `SELECT 
        id,
        setting_key as key,
        setting_value as value,
        setting_type as type,
        description,
        updated_at
       FROM system_settings WHERE id = ?`,
      [params.id]
    );
    
    const settingArray = updatedSettings as any[];
    if (settingArray.length === 0) {
      return NextResponse.json(
        { error: 'System setting not found after update' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(settingArray[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update system setting' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First check if setting exists
    const [existing] = await db.query(
      'SELECT id FROM system_settings WHERE id = ?',
      [params.id]
    );
    
    if ((existing as any[]).length === 0) {
      return NextResponse.json(
        { error: 'System setting not found' },
        { status: 404 }
      );
    }
    
    // Delete system setting
    await db.query('DELETE FROM system_settings WHERE id = ?', [params.id]);
    
    return NextResponse.json({ message: 'System setting deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete system setting' },
      { status: 500 }
    );
  }
}