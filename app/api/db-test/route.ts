import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function GET() {
  try {
    const result = await query('SELECT NOW()');
    return NextResponse.json({
      ok: true,
      now: result.rows[0].now,
    });
  } catch (error: any) {
    console.error('DB TEST ERROR:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message ?? 'Unknown error',
      },
      { status: 500 }
    );
  }
}
