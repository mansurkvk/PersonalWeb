import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { submitContactMessage } from "@/services/contact.service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const session = await readSession();

    await submitContactMessage({
      ...body,
      userId: session?.userId,
      sessionEmail: session?.email
    });

    return NextResponse.json({ ok: true, message: "Mesaj kaydedildi." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Mesaj gonderilirken bir hata olustu.";
    const isValidationError = message.includes("gerekli") || message.includes("karakter") || message.includes("olmali");

    return NextResponse.json(
      {
        ok: false,
        message: isValidationError ? message : "Mesaj gonderilirken bir hata olustu."
      },
      { status: isValidationError ? 400 : 500 }
    );
  }
}
