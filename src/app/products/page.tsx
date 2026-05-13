import type { Metadata } from "next";
import { ProductsPage } from "@/features/products/products-page";

export const metadata: Metadata = {
  title: "Urunler",
  description: "Robotik sistemler, egitim platformlari, uretim otomasyonu ve IoT telemetry paketleri icin Harezmi Robotics urun vitrini."
};

export default function ProductsRoutePage() {
  return <ProductsPage />;
}
