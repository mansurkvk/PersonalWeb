import { getDb } from "@/lib/db/mongodb";
import { tryObjectId } from "@/lib/db/object-id";
import type { AuditLogDocument } from "@/types/database";

export async function auditLogsCollection() {
  const db = await getDb();
  return db.collection<AuditLogDocument>("auditLogs");
}

export async function createAuditLog(input: {
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  const auditLogs = await auditLogsCollection();
  await auditLogs.insertOne({
    actorUserId: tryObjectId(input.actorUserId) ?? undefined,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    metadata: input.metadata,
    createdAt: new Date()
  });
}
