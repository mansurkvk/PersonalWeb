"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { ContactMessageStatus } from "@/types/database";

const actions: { label: string; status: ContactMessageStatus }[] = [
  { label: "Okundu yap", status: "read" },
  { label: "Yanitlandi yap", status: "replied" },
  { label: "Arsivle", status: "archived" }
];

export function ContactMessageActions({ messageId, currentStatus }: { messageId: string; currentStatus: ContactMessageStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function updateStatus(status: ContactMessageStatus) {
    startTransition(async () => {
      await fetch(`/api/admin/contact-messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      router.refresh();
    });
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {actions.map((action) => (
        <button
          key={action.status}
          type="button"
          disabled={pending || action.status === currentStatus}
          onClick={() => updateStatus(action.status)}
          className="min-h-10 rounded-full border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
