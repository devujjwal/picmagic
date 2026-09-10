export const dynamic = "force-dynamic";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "PicMagic Admin",
  robots: { index: false, follow: false },
};
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container">{children}</div>;
}
