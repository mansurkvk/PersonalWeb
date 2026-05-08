import { redirect } from "next/navigation";

// Eski /admin/login adresi korunur; tek giris noktasi /login.
export default function AdminLoginRedirectPage() {
  redirect("/login");
}
