import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ESN Porto Store",
  description: "Official merch for Erasmus students in Porto. Wear your Erasmus, take a piece of Porto home.",
  openGraph: {
    title: "ESN Porto Store",
    description: "Official merch for Erasmus students in Porto.",
    siteName: "ESN Porto Store",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(bebasNeue.variable, dmSans.variable)}>
      <body>
        <div className="esn-brand-stripe fixed top-0 left-0 right-0 z-[100]" />
        <div className="pt-1">{children}</div>
      </body>
    </html>
  );
}
