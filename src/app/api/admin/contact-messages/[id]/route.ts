import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { isContactMessageStatus, markContactMessageStatus } from "@/services/contact.service";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = (await request.json()) as { status?: string };

    if (!body.status || !isContactMessageStatus(body.status)) {
      return NextResponse.json({ ok: false, message: "Gecersiz mesaj durumu." }, { status: 400 });
    }

    await markContactMessageStatus(id, body.status);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Admin yetkisi gerekli veya islem basarisiz." }, { status: 403 });
  }
}
