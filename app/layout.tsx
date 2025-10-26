import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { MarketDataProvider } from "@/contexts/MarketDataContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Market Movers - Real-Time Stock Scanner",
  description: "Professional real-time stock scanner dashboard for day trading",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <MarketDataProvider>
              {children}
            </MarketDataProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
