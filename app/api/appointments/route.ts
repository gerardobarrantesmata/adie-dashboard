// app/api/appointments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/appointments?date=2025-12-09&doctorId=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const date = searchParams.get("date");        // YYYY-MM-DD
  const doctorId = searchParams.get("doctorId"); // opcional

  if (!date) {
    return NextResponse.json(
      { error: "Missing 'date' query param (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  const startOfDay = `${date} 00:00:00`;
  const endOfDay = `${date} 23:59:59`;

  const values: any[] = [startOfDay, endOfDay];
  let whereClause = "start_time >= $1 AND start_time <= $2";

  if (doctorId) {
    whereClause += " AND doctor_id = $3";
    values.push(doctorId);
  }

  try {
    const result: any = await query(
      `
      SELECT
        id,
        doctor_id,
        patient_id,
        title,
        description,
        status,
        start_time,
        end_time,
        location
      FROM appointments
      WHERE ${whereClause}
      ORDER BY start_time ASC
      `,
      values
    );

    return NextResponse.json({ appointments: result.rows });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Error fetching appointments" },
      { status: 500 }
    );
  }
}

// POST /api/appointments
export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    doctorId,
    patientId,
    title,
    description,
    startTime,
    endTime,
    location,
  } = body;

  if (!doctorId || !patientId || !title || !startTime || !endTime) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const result: any = await query(
      `
      INSERT INTO appointments (
        doctor_id,
        patient_id,
        title,
        description,
        status,
        start_time,
        end_time,
        location
      )
      VALUES ($1, $2, $3, $4, 'scheduled', $5, $6, $7)
      RETURNING *
      `,
      [doctorId, patientId, title, description, startTime, endTime, location]
    );

    const appointment = result.rows[0];

    // Aquí, en el futuro, llamaremos a Google Calendar si el doctor tiene vínculo.

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Error creating appointment" },
      { status: 500 }
    );
  }
}
