import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import {
  hashPassword,
  verifyPassword,
  createToken,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "signup") {
      const { email, password, firmName } = body;

      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
      }

      if (password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
      }

      const existing = getUserByEmail(email);
      if (existing) {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
      }

      const passwordHash = await hashPassword(password);
      const userId = uuid();
      const user = createUser(userId, email, passwordHash, firmName);

      const token = createToken({ userId: user.id, email: user.email });
      const res = NextResponse.json({ success: true, userId: user.id });
      res.headers.set("Set-Cookie", setSessionCookie(token));
      return res;
    }

    if (action === "login") {
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
      }

      const user = getUserByEmail(email);
      if (!user) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      const valid = await verifyPassword(password, user.password_hash);
      if (!valid) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      const token = createToken({ userId: user.id, email: user.email });
      const res = NextResponse.json({ success: true, userId: user.id });
      res.headers.set("Set-Cookie", setSessionCookie(token));
      return res;
    }

    if (action === "logout") {
      const res = NextResponse.json({ success: true });
      res.headers.set("Set-Cookie", clearSessionCookie());
      return res;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[auth] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
