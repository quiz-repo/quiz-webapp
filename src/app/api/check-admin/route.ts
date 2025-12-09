export const dynamic = "force-dynamic";
export const revalidate = 0;
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initAdmin } from "@/lib/firebaseAdmin";


initAdmin();

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    const decoded = await getAuth().verifyIdToken(token);

    console.log("Decoded email:", decoded.email);
    console.log("ADMIN_EMAIL:", process.env.NEXT_PUBLIC_ADMIN_EMAIL);
    // console.log("Aryan private key:", process.env.FIREBASE_ADMIN_PRIVATE_KEY);

    const isAdmin = decoded.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    return NextResponse.json({ isAdmin });
  } catch (error: any) {
    console.error("CHECK-ADMIN ERROR:", error);
    return NextResponse.json({ isAdmin: false, error: error.message }, { status: 500 });
  }
}
