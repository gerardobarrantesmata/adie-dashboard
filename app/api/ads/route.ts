import { NextResponse } from "next/server";
import path from "path";
import { readdir } from "fs/promises";

export const dynamic = "force-dynamic";

const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

export async function GET() {
  try {
    const adsDir = path.join(process.cwd(), "public", "ads");
    const files = await readdir(adsDir);

    const images = files
      .filter((f) => ALLOWED_EXT.has(path.extname(f).toLowerCase()))
      .filter((f) => !f.startsWith(".")) // evita .DS_Store, etc.
      .sort((a, b) => a.localeCompare(b));

    // Devolvemos URLs públicas (Next sirve /public como raíz)
    const urls = images.map((f) => `/ads/${encodeURIComponent(f)}`);

    return NextResponse.json({ ads: urls });
  } catch (e) {
    // Si la carpeta no existe o hay error, devolvemos vacío
    return NextResponse.json({ ads: [] }, { status: 200 });
  }
}
