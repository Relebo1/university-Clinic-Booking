import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const nurseId = url.searchParams.get('nurse_id'); // use nurse_id consistently

    if (!nurseId) {
      return NextResponse.json(
        { error: 'Missing nurse_id parameter' },
        { status: 400 }
      );
    }

    // 1️⃣ Get all appointments for this nurse
    const [appointments]: any = await db.query(
      'SELECT * FROM appointments WHERE nurse_id = ?',
      [nurseId]
    );

    if (!appointments || appointments.length === 0) {
      return NextResponse.json([]);
    }

    // 2️⃣ Extract unique patient IDs
    const patientIds = [...new Set(appointments.map((apt: any) => apt.patient_id))]; // ensure consistent column

    if (patientIds.length === 0) {
      return NextResponse.json([]);
    }

    // 3️⃣ Get patient details
    const [patients]: any = await db.query(
      `SELECT id, name, email, phone, role, student_id
       FROM users
       WHERE id IN (?)`,
      [patientIds]
    );

    const patientsArray = Array.isArray(patients) ? patients : [];

    // 4️⃣ Add appointment stats for each patient
    const patientsWithStats = patientsArray.map((patient: any) => {
      const patientAppointments = appointments.filter(
        (apt: any) => apt.patient_id === patient.id
      );

      const completedAppointments = patientAppointments.filter(
        (apt: any) => apt.status === 'completed'
      );

      const upcomingAppointment = patientAppointments.find(
        (apt: any) =>
          apt.status === 'confirmed' &&
          new Date(apt.date) >= new Date()
      );

      const lastVisit = completedAppointments.length
        ? completedAppointments
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0]
            .date
        : null;

      return {
        ...patient,
        totalVisits: completedAppointments.length,
        lastVisit,
        nextAppointment: upcomingAppointment || null,
      };
    });

    return NextResponse.json(patientsWithStats);
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}
