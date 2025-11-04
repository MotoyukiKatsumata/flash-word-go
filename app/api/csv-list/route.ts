import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const dir = path.join(process.cwd(), "data/csv");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".csv"));
  return NextResponse.json({ files });
}
