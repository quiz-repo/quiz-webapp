"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function HomesPage() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.replace("/login");
    }
  }, []);

  return <div>Homes Page Content</div>;
}
