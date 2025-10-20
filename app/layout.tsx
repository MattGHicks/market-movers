import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/context/QueryProvider";
import { FilterProvider } from "@/context/FilterContext";
import { AlertProvider } from "@/context/AlertContext";
import { WindowProvider } from "@/context/WindowContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AlertNotifications } from "@/components/AlertNotifications";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Market Movers Pro - Real-Time Stock Trading Platform",
  description: "Professional trading platform with customizable scanners and real-time market data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>
            <FilterProvider>
              <AlertProvider>
                <WindowProvider>
                  <AlertNotifications />
                  {children}
                </WindowProvider>
              </AlertProvider>
            </FilterProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
