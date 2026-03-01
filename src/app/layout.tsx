import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "AnthroLoop — 透明性ホームページ",
  description:
    "AI自律型組織の意思決定プロセスを公開し、経営の透明性を高めます。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <Header />
        <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
