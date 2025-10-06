import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [notifications] = await db.query(
      `SELECT 
        n.id,
        n.user_id as userId,
        n.title,
        n.message,
        n.type,
        n.read_status as readStatus,
        n.created_at as createdAt,
        u.name as userName,
        u.email as userEmail
       FROM notifications n
       LEFT JOIN users u ON n.user_id = u.id
       WHERE n.id = ?`,
      [params.id]
    );
    
    const notificationArray = notifications as any[];
    if (notificationArray.length === 0) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(notificationArray[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification' },
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
    
    // Only allow updating read_status for notifications
    const allowedFields = ['readStatus'];
    const setClauses: string[] = [];
    const values: any[] = [];
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        // Map readStatus to read_status for database
        const dbField = field === 'readStatus' ? 'read_status' : field;
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
      UPDATE notifications 
      SET ${setClauses.join(', ')}
      WHERE id = ?
    `;
    
    await db.query(query, values);
    
    // Fetch updated notification
    const [updatedNotifications] = await db.query(
      `SELECT 
        n.id,
        n.user_id as userId,
        n.title,
        n.message,
        n.type,
        n.read_status as readStatus,
        n.created_at as createdAt,
        u.name as userName,
        u.email as userEmail
       FROM notifications n
       LEFT JOIN users u ON n.user_id = u.id
       WHERE n.id = ?`,
      [params.id]
    );
    
    const notificationArray = updatedNotifications as any[];
    if (notificationArray.length === 0) {
      return NextResponse.json(
        { error: 'Notification not found after update' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(notificationArray[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First check if notification exists
    const [existing] = await db.query(
      'SELECT id FROM notifications WHERE id = ?',
      [params.id]
    );
    
    if ((existing as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    // Delete notification
    await db.query('DELETE FROM notifications WHERE id = ?', [params.id]);
    
    return NextResponse.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}