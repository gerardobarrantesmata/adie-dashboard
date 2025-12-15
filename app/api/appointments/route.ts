// app/api/appointments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * Definitivo: tu DB usa appointment_datetime + duration_minutes + provider_id.
 * Esta ruta normaliza la respuesta a:
 * - start_time (appointment_datetime)
 * - end_time   (appointment_datetime + duration_minutes)
 *
 * GET /api/appointments?date=YYYY-MM-DD&providerId=...
 * (también acepta doctorId como alias)
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const date = searchParams.get("date"); // YYYY-MM-DD
  const providerId = searchParams.get("providerId") || searchParams.get("doctorId"); // alias

  if (!date) {
    return NextResponse.json(
      { error: "Missing 'date' query param (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  // Rango definitivo: [startOfDay, nextDay)
  const start = new Date(`${date}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const values: any[] = [start, end];
  let whereClause = "appointment_datetime >= $1 AND appointment_datetime < $2";

  if (providerId) {
    whereClause += " AND provider_id = $3";
    values.push(providerId);
  }

  try {
    const result: any = await query(
      `
      SELECT
        appointment_id AS id,
        provider_id   AS doctor_id,
        patient_id,
        appointment_type AS title,
        notes            AS description,
        status,
        appointment_datetime AS start_time,
        (appointment_datetime + make_interval(mins => COALESCE(duration_minutes, 30))) AS end_time,
        clinic_id::text AS location
      FROM appointments
      WHERE ${whereClause}
      ORDER BY appointment_datetime ASC
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

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Aceptamos ambos nombres para no romper frontend
  const providerId = body.providerId || body.doctorId;
  const patientId = body.patientId;

  // En tu esquema real
  const appointmentType = body.appointmentType || body.title || "Appointment";
  const notes = body.notes || body.description || null;
  const appointmentDatetime = body.startTime || body.appointmentDatetime;
  const durationMinutes =
    typeof body.durationMinutes === "number" ? body.durationMinutes : 30;

  const clinicId = body.clinicId ?? null;

  if (!providerId || !patientId || !appointmentDatetime) {
    return NextResponse.json(
      { error: "Missing required fields: providerId/doctorId, patientId, startTime" },
      { status: 400 }
    );
  }

  try {
    const result: any = await query(
      `
      INSERT INTO appointments (
        provider_id,
        patient_id,
        appointment_type,
        notes,
        status,
        appointment_datetime,
        duration_minutes,
        clinic_id
      )
      VALUES ($1, $2, $3, $4, 'scheduled', $5, $6, $7)
      RETURNING
        appointment_id AS id,
        provider_id   AS doctor_id,
        patient_id,
        appointment_type AS title,
        notes            AS description,
        status,
        appointment_datetime AS start_time,
        (appointment_datetime + make_interval(mins => COALESCE(duration_minutes, 30))) AS end_time,
        clinic_id::text AS location
      `,
      [
        providerId,
        patientId,
        appointmentType,
        notes,
        appointmentDatetime,
        durationMinutes,
        clinicId,
      ]
    );

    return NextResponse.json({ appointment: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Error creating appointment" },
      { status: 500 }
    );
  }
}
