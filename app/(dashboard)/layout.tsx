import { requireAuth } from "@/app/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth(); // ✅ 未登录会 redirect("/auth/login")

  return <>{children}</>;
}
