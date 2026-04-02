import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ESN Porto Store",
  description: "Official ESN Porto merchandise store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* Brand stripe — 4 cores ESN fixas no topo absoluto */}
        <div className="esn-brand-stripe fixed top-0 left-0 right-0 z-[100]" />

        {/* Offset da stripe (4px) */}
        <div className="pt-1">
          <Header />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
