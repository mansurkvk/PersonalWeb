import { NextResponse } from "next/server";
import { pingMongoDb } from "@/lib/db/mongodb";

export async function GET() {
  try {
    const result = await pingMongoDb();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ ok: false, error: "MongoDB ping basarisiz." }, { status: 500 });
  }
}
