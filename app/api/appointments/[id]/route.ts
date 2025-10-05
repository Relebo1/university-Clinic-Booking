import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET a single appointment by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await db.query(
      'SELECT * FROM appointments WHERE id = ?',
      [params.id]
    );
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
  }
}

// PATCH (update/reschedule) an appointment
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await req.json();

    // Build dynamic query
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);

    const [result] = await db.query(
      `UPDATE appointments SET ${fields} WHERE id = ?`,
      [...values, params.id]
    );

    // Fetch updated appointment
    const [rows] = await db.query('SELECT * FROM appointments WHERE id = ?', [params.id]);
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'Appointment not found after update' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

// DELETE an appointment
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Fetch appointment before deletion
    const [rows] = await db.query('SELECT * FROM appointments WHERE id = ?', [params.id]);
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Delete the appointment
    await db.query('DELETE FROM appointments WHERE id = ?', [params.id]);

    return NextResponse.json(rows[0]); // return deleted appointment
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}
