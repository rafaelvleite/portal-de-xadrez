import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xadrez Hoje — Em breve",
  description: "O xadrez que importa, hoje — em português e com contexto."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
