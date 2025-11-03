import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin", "japanese"],
});

export const metadata: Metadata = {
  title: "脳内世界旅行",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${notoSansJP.variable} antialiased`}>
        <main className="flex-1 text-sm md:text-base">{children}</main>
      </body>
    </html>
  );
}
