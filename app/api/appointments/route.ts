// /app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ----------------------------
// GET: Fetch appointments
// ----------------------------
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId'); // optional filter
    const role = url.searchParams.get('role');     // student, nurse, admin
    const status = url.searchParams.get('status'); // optional
    const type = url.searchParams.get('type');     // optional

    let query = 'SELECT * FROM appointments';
    const conditions: string[] = [];
    const params: any[] = [];

    // Filter by role and userId
    if (userId && role) {
      if (role === 'student' || role === 'staff') {
        conditions.push('patient_id = ?');
        params.push(userId);
      } else if (role === 'nurse') {
        conditions.push('nurse_id = ?');
        params.push(userId);
      }
    }

    // Filter by status or type
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (type) {
      conditions.push('type = ?');
      params.push(type);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY date DESC, time DESC';

    const [appointments] = await db.query(query, params);
    return NextResponse.json(appointments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

// ----------------------------
// POST: Create appointment
// ----------------------------
export async function POST(req: NextRequest) {
  try {
    const appointment = await req.json();

    let nurseId = appointment.nurseId;
    let nurseName = appointment.nurseName;

    // Auto-assign nurse if "auto"
    if (!nurseId || nurseId === 'auto') {
      const [availableNurses] = await db.query(
        `SELECT id, name FROM users 
         WHERE role = 'nurse' AND id NOT IN (
           SELECT nurse_id FROM appointments WHERE date = ? AND time = ?
         )`,
        [appointment.date, appointment.time]
      );

      if (Array.isArray(availableNurses) && availableNurses.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableNurses.length);
        nurseId = availableNurses[randomIndex].id;
        nurseName = availableNurses[randomIndex].name;
      } else {
        return NextResponse.json({ error: 'No available nurses at this time' }, { status: 409 });
      }
    } else {
      // Check conflict for chosen nurse
      const [conflicts] = await db.query(
        `SELECT * FROM appointments WHERE nurse_id = ? AND date = ? AND time = ?`,
        [nurseId, appointment.date, appointment.time]
      );
      if (Array.isArray(conflicts) && conflicts.length > 0) {
        return NextResponse.json({ error: 'Selected nurse is not available at this time' }, { status: 409 });
      }
    }

    // Insert appointment
    const [result] = await db.query(
      `INSERT INTO appointments
      (patient_id, patient_name, patient_email, nurse_id, nurse_name, date, time, end_time, status, type, notes, symptoms, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        appointment.patientId,
        appointment.patientName,
        appointment.patientEmail,
        nurseId,
        nurseName,
        appointment.date,
        appointment.time,
        appointment.endTime,
        appointment.status || 'pending',
        appointment.type,
        appointment.notes || null,
        appointment.symptoms || null,
        appointment.priority || 'normal'
      ]
    );

    return NextResponse.json({ id: (result as any).insertId, ...appointment, nurseId, nurseName }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

// ----------------------------
// PUT: Update/Reschedule appointment
// ----------------------------
export async function PUT(req: NextRequest) {
  try {
    const { id, date, time, endTime, nurseId, nurseName, status, type, notes, symptoms, priority } = await req.json();

    // Check conflict for nurse if date/time changed
    if (nurseId && date && time) {
      const [conflicts] = await db.query(
        `SELECT * FROM appointments WHERE nurse_id = ? AND date = ? AND time = ? AND id != ?`,
        [nurseId, date, time, id]
      );
      if (Array.isArray(conflicts) && conflicts.length > 0) {
        return NextResponse.json({ error: 'Selected nurse is not available at this time' }, { status: 409 });
      }
    }

    // Update appointment
    await db.query(
      `UPDATE appointments SET date = ?, time = ?, end_time = ?, nurse_id = ?, nurse_name = ?, status = ?, type = ?, notes = ?, symptoms = ?, priority = ?
       WHERE id = ?`,
      [date, time, endTime, nurseId, nurseName, status, type, notes, symptoms, priority, id]
    );

    return NextResponse.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

// ----------------------------
// DELETE: Cancel appointment
// ----------------------------
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });

    await db.query(`DELETE FROM appointments WHERE id = ?`, [id]);
    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}
