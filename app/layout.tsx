import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DJOB FACIL - Plataforma Moçambicana de Serviços",
  description: "Conectando quem precisa com quem oferece. Serviços, pedidos e marketplace em Moçambique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-MZ">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
