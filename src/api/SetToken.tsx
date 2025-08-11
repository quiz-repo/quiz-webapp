
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  if (!token) return res.status(400).json({ error: "Token required" });

  const cookie = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  res.setHeader("Set-Cookie", cookie);
  res.status(200).json({ message: "Token set successfully" });
}
