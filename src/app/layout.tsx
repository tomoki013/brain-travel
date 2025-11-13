import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Geo Linker",
  description: "Geo Linkerへようこそ！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* Google Search Console */}
        <meta
          name="google-site-verification"
          content="qd9h_oeUkXKK0F-u4U5Z-c540MUq_Agst3K0rF8ERdM"
        />

        {/* Google Adsense */}
        <meta name="google-adsense-account" content="ca-pub-8687520805381056" />
      </head>
      <body className={`${notoSansJP.variable} antialiased`}>
        <main className="flex-1 text-sm md:text-base">{children}</main>
      </body>
    </html>
  );
}
