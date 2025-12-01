import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RouteProtector } from "./RouteProtector";

import { ConfigProvider } from "antd"; // ✅ Add this

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quizzy",
};

require("../../src/scripts/data-insert");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigProvider wave={{ disabled: true }}>
          <AuthProvider>
            <RouteProtector>{children}</RouteProtector>
            <ToastContainer />
          </AuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
