import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "LUNC Terminal | The Ultimate Terra Luna Classic Dashboard",
  description: "The reference terminal for the Terra Luna Classic ecosystem.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-white antialiased">
        <Providers>
          <Navbar />
          <main className="pt-32">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}