import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Album",
  description: "Your private photo album. Share when you want.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem("theme");
                  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  if (theme === "dark" || (!theme && prefersDark)) {
                    document.documentElement.classList.add("dark");
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${plusJakarta.variable} flex min-h-screen flex-col font-sans antialiased`}>
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
