export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initAdmin } from "@/lib/firebaseAdmin";

initAdmin();

export async function POST(req: Request) {
  try {
    console.log("🔹 Admin check API called");

    const body = await req.json();
    console.log("🔹 Request body:", body);

    const { token } = body;

    if (!token) {
      console.log("❌ Token missing in request");
      return NextResponse.json(
        { isAdmin: false, error: "Token is required" },
        { status: 400 }
      );
    }

    console.log("🔹 Verifying Firebase ID token...");

    const decoded = await getAuth().verifyIdToken(token);

    console.log("✅ Token verified successfully");
    console.log("🔹 Decoded token data:", {
      uid: decoded.uid,
      email: decoded.email,
      email_verified: decoded.email_verified,
      provider_id: decoded.firebase?.sign_in_provider,
      auth_time: decoded.auth_time,
      iat: decoded.iat,
      exp: decoded.exp,
    });

    console.log("🔹 Admin email from ENV:", process.env.ADMIN_EMAIL);

    const isAdmin = decoded.email === process.env.ADMIN_EMAIL;

    console.log("🔹 Is Admin:", isAdmin);

    return NextResponse.json({ isAdmin });
  } catch (error: any) {
    console.error("🔥 Admin check API error:", {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { isAdmin: false, error: error.message },
      { status: 500 }
    );
  }
}
