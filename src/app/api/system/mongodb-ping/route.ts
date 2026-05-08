import { NextResponse } from "next/server";
import { pingMongoDb } from "@/lib/db/mongodb";

export async function GET() {
  if (process.env.DATA_SOURCE !== "mongodb") {
    return NextResponse.json({
      ok: true,
      dataSource: "static",
      database: "github-static-store",
      message: "MongoDB devre disi. Sistem GitHub icindeki statik veri katmani ile calisiyor. DATA_SOURCE=mongodb yapilirsa MongoDB ping denenir."
    });
  }

  try {
    const result = await pingMongoDb();
    return NextResponse.json({ ...result, dataSource: "mongodb" });
  } catch (error) {
    console.error("MongoDB ping error:", error);

    return NextResponse.json(
      {
        ok: false,
        dataSource: "mongodb",
        error: "MongoDB ping basarisiz.",
        detail: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
