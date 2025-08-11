import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import 'antd/dist/reset.css';
import { AuthProvider } from "../lib/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RouteProtector } from "./RouteProtector";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quizzy",
  // description:
  //   "Discover the next generation of web applications built with cutting-edge technology.",
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
        <AuthProvider>
          <RouteProtector>{children}</RouteProtector>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
