"use server";
import { prisma } from "@/lib/prisma";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { ActionResultType } from "@/types/ServerLinksType";
import { redirect } from "next/navigation";

interface JWTPayload {
  username: string;
}

type VerifyJWTResult =
  | { ok: true; payload: JWTPayload }
  | { ok: false; reason: "NO_TOKEN" | "INVALID_TOKEN" | "EXPIRED_TOKEN" };

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function genJWT(payload: JWTPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1y" });
}

export async function verifyJWT(
  tokenFromParam?: string
): Promise<VerifyJWTResult> {
  // 允许外部传入 token（例如你有些 route handler token 不在 cookie 中）
  const token = tokenFromParam ?? (await cookies()).get("token")?.value;

  if (!token) {
    return { ok: false, reason: "NO_TOKEN" };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    // ✅ 校验 payload 结构
    if (!decoded || typeof decoded !== "object" || !decoded.username) {
      return { ok: false, reason: "INVALID_TOKEN" };
    }

    return { ok: true, payload: { username: String(decoded.username) } };
  } catch (err: unknown) {
    // jsonwebtoken 对 token 过期会抛 TokenExpiredError
    if (err instanceof jwt.TokenExpiredError) {
      return { ok: false, reason: "EXPIRED_TOKEN" };
    }
    return { ok: false, reason: "INVALID_TOKEN" };
  }
}

export async function requireAuth(): Promise<JWTPayload> {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/auth/login"); 
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    if (!payload || typeof payload !== "object" || !payload.username) {
      redirect("/auth/login");
    }

    return { username: String(payload.username) };
  } catch {
    redirect("/auth/login");
  }
}

async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    expires: new Date(Date.now() + 3600 * 1000 * 24 * 365),
  });
}

export async function checkLogin(
  prevState: ActionResultType<string> | null,
  formData: FormData
): Promise<ActionResultType<string>> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!username) return { ok: false, msg: "Username Cannot be null" };
  if (!password) return { ok: false, msg: "Password Cannot be null" };

  const result = await prisma.admin.findFirst({
    where: { username },
  });

  if (!result) return { ok: false, msg: "Username Incorrect" };
  if (password !== result.password)
    return { ok: false, msg: "Password Incorrect" };

  const token = await genJWT({ username });
  await setAuthCookie(token);

  redirect("/"); // ✅ 登录成功直接回到根目录
}

export async function registerAcc(
  prevState: ActionResultType<string> | null,
  formData: FormData
): Promise<ActionResultType<string>> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!username) return { ok: false, msg: "Username Cannot be null" };
  if (!password) return { ok: false, msg: "Password Cannot be null" };

  const existingAdmin = await prisma.admin.findFirst();
  if (existingAdmin) {
    return {
      ok: false,
      msg: "Admin already exists. Only one admin is allowed.",
    };
  }

  try {
    await prisma.admin.create({
      data: { id: 1, username, password },
    });

    // ✅ 注册成功=登录成功 → 写 cookie
    const token = await genJWT({ username });
    await setAuthCookie(token);

    redirect("/"); // ✅ 第一次注册成功直接回根目录
  } catch (err: unknown) {
    return {
      ok: false,
      msg:
        "Register failed: " +
        (err instanceof Error ? err.message : "Unknown error"),
    };
  }
}

export async function hasAdmin(): Promise<boolean> {
  const admin = await prisma.admin.findFirst({
    select: { id: true },
  });
  return !!admin;
}
