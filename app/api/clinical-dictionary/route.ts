import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      `SELECT term_id, term_type, name
       FROM clinical_dictionary
       WHERE is_active = TRUE
       ORDER BY term_type, name`
    );

    return NextResponse.json({ ok: true, terms: result.rows });
  } catch (error: any) {
    console.error('GET /api/clinical-dictionary ERROR:', error);
    return NextResponse.json(
      { ok: false, error: error.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}
