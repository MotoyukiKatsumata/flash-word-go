import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("file");
  if (!filename) return NextResponse.json({ error: "ファイル名が指定されていません" }, { status: 400 });

  const filePath = path.join(process.cwd(), "data/csv", filename);
  if (!fs.existsSync(filePath))
    return NextResponse.json({ error: "ファイルが存在しません" }, { status: 404 });

  const csv = fs.readFileSync(filePath, "utf8");
  const parsed = Papa.parse(csv, { header: false }).data as string[][];

  // バリデーション
  if (parsed.length < 5 || parsed.length > 200)
    return NextResponse.json({ error: "行数が不正です（5～200行にしてください）" }, { status: 400 });
  if (!parsed.every(r => r.length === 2))
    return NextResponse.json({ error: "列数が2列ではありません" }, { status: 400 });

  const result = parsed.map(r => ({ en: r[0].trim(), ja: r[1].trim() }));
  return NextResponse.json(result);
}
