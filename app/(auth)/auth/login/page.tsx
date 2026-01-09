import AuthCard from "@/components/authCard";
import { hasAdmin } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { verifyJWT } from "@/app/actions/auth";

export default async function loginPage() {
  const auth = await verifyJWT();
  if (auth.ok) {
    redirect("/");
  }
  const exists = await hasAdmin();

  if (!exists) {
    redirect("/auth/register");
  }

  return <AuthCard cardType="login" />;
}
