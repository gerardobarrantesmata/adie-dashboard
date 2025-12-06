// app/api/patients/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

/* -------------------- GET: lista pacientes -------------------- */

export async function GET() {
  try {
    const res = await query(
      `
      SELECT
        patient_id,
        first_name,
        last_name,
        date_of_birth,
        phone_mobile,
        email,
        country,
        city,
        preferred_language
      FROM patients
      ORDER BY patient_id DESC
      LIMIT 50;
      `,
      []
    );

    return NextResponse.json(
      { ok: true, patients: res.rows },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/patients ERROR:", error);
    return NextResponse.json(
      { ok: false, error: error.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

/* -------------------- POST: crear nuevo paciente -------------------- */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstName = body.first_name ?? body.firstName ?? "";
    const lastName = body.last_name ?? body.lastName ?? "";
    const dateOfBirth = body.date_of_birth ?? null; // "YYYY-MM-DD" ya armado en el FRONT
    const phoneMobile =
      body.phone_mobile ?? body.mobilePhone ?? body.whatsappMobile ?? "";
    const email = body.email ?? "";
    const clinicId = body.clinic_id ?? body.clinicId ?? 1;

    // Validaciones mínimas
    if (!firstName || !lastName || !dateOfBirth || !phoneMobile || !email) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing required fields (name, DOB, phone, email).",
        },
        { status: 400 }
      );
    }

    // Insert principal en patients
    const insertRes = await query(
      `
      INSERT INTO patients (
        first_name,
        last_name,
        date_of_birth,
        phone_mobile,
        email,
        clinic_id
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING patient_id, first_name, last_name, date_of_birth, phone_mobile, email;
      `,
      [firstName, lastName, dateOfBirth, phoneMobile, email, clinicId]
    );

    const patient = insertRes.rows[0];
    const patientId = patient.patient_id;

    // Conectar por defecto con "General Dentistry" (asumimos specialty_id = 1)
    const GENERAL_DENTISTRY_ID = 1;

    await query(
      `
      INSERT INTO patient_specialties (patient_id, specialty_id, is_primary)
      VALUES ($1, $2, TRUE)
      ON CONFLICT (patient_id, specialty_id) DO NOTHING;
      `,
      [patientId, GENERAL_DENTISTRY_ID]
    );

    return NextResponse.json({ ok: true, patient }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/patients ERROR:", error);
    return NextResponse.json(
      { ok: false, error: error.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
