import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { isContactMessageStatus, listAdminContactMessages } from "@/services/contact.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const statusParam = url.searchParams.get("status");
    const status = statusParam && isContactMessageStatus(statusParam) ? statusParam : undefined;
    const messages = await listAdminContactMessages(status);

    return NextResponse.json({ ok: true, messages });
  } catch {
    return NextResponse.json({ ok: false, message: "Admin yetkisi gerekli." }, { status: 403 });
  }
}
