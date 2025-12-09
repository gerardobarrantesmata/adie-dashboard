import { NextResponse } from "next/server";
import { query } from "@/lib/db";

type PatientRow = {
  patient_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  phone_mobile: string | null;
  email: string | null;
  country: string | null;
  city: string | null;
  preferred_language: string | null;
};

// GET /api/patients
// Devuelve la lista para la tabla de "Existing patients"
export async function GET() {
  try {
    const result: any = await query(
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
      LIMIT 500;
      `
    );

    const patients = result.rows as PatientRow[];

    return NextResponse.json(
      {
        ok: true,
        patients,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error loading patients:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Error loading patients",
      },
      { status: 500 }
    );
  }
}

// POST /api/patients
// Crea un nuevo paciente y lo conecta con General Dentistry (GEN)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      first_name,
      last_name,
      date_of_birth,
      phone_mobile,
      email,
      clinic_id,
      country,
      city,
      preferred_language,
    } = body;

    // Validaciones básicas (alineadas con el frontend)
    if (!first_name || !last_name) {
      return NextResponse.json(
        { ok: false, error: "First name and last name are required." },
        { status: 400 }
      );
    }

    if (!date_of_birth) {
      return NextResponse.json(
        { ok: false, error: "Date of birth is required." },
        { status: 400 }
      );
    }

    if (!phone_mobile) {
      return NextResponse.json(
        { ok: false, error: "Mobile / WhatsApp number is required." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Email is required." },
        { status: 400 }
      );
    }

    //--------------------------------------------------
    // 1) Insertar paciente en patients
    //--------------------------------------------------
    const insertPatientRes: any = await query(
      `
      INSERT INTO patients (
        clinic_id,
        first_name,
        last_name,
        date_of_birth,
        phone_mobile,
        email,
        country,
        city,
        preferred_language
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING patient_id;
      `,
      [
        clinic_id || 1,
        first_name,
        last_name,
        date_of_birth,
        phone_mobile,
        email,
        country ?? null,
        city ?? null,
        preferred_language ?? null,
      ]
    );

    const newPatientId: number = insertPatientRes.rows[0].patient_id;

    //--------------------------------------------------
    // 2) Obtener specialty_id de General Dentistry (GEN)
    //--------------------------------------------------
    const specialtyRes: any = await query(
      `
      SELECT specialty_id
      FROM specialties
      WHERE code = 'GEN'
         OR specialty_code = 'GEN'
      LIMIT 1;
      `
    );

    if (specialtyRes.rowCount && specialtyRes.rows[0]) {
      const specialtyId: number = specialtyRes.rows[0].specialty_id;

      //--------------------------------------------------
      // 3) Insertar vínculo en patient_specialties
      //--------------------------------------------------
      await query(
        `
        INSERT INTO patient_specialties (
          patient_id,
          specialty_id,
          is_primary
        )
        VALUES ($1, $2, TRUE)
        ON CONFLICT (patient_id, specialty_id) DO NOTHING;
        `,
        [newPatientId, specialtyId]
      );
    } else {
      console.warn(
        "Specialty GEN (General Dentistry) not found. Patient created without specialty link."
      );
    }

    return NextResponse.json(
      {
        ok: true,
        patient_id: newPatientId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error saving patient:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Error saving patient",
      },
      { status: 500 }
    );
  }
}
