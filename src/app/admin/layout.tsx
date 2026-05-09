import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await readSession();

  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/profile");

  return children;
}
