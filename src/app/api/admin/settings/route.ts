import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { jsonError } from "@/lib/http/responses";
import { siteSettingsSchema } from "@/lib/validators";
import { createAuditLog } from "@/repositories/audit.repository";
import { updateSiteSettings } from "@/repositories/site-settings.repository";

export async function PATCH(request: Request) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return jsonError("Admin yetkisi gerekli.", 403);
  }

  const input = siteSettingsSchema.safeParse(await request.json());
  if (!input.success) return jsonError("Site ayarlari gecersiz.", 400, input.error.flatten());

  await updateSiteSettings(input.data);
  await createAuditLog({ actorUserId: session.userId, action: "settings.update", entityType: "siteSettings" });
  return NextResponse.json({ ok: true });
}
