import { NextResponse } from "next/server";
import { Client } from "pg";

export async function GET() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    return NextResponse.json(
      { ok: false, error: "DATABASE_URL is missing in env" },
      { status: 500 }
    );
  }

  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const r = await client.query(
      "select now() as now, current_database() as db, current_user as db_user"
    );
    return NextResponse.json({ ok: true, ...r.rows[0] });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "db_error" },
      { status: 500 }
    );
  } finally {
    await client.end().catch(() => {});
  }
}
