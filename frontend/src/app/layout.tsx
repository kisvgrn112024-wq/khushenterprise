import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from '@/context/ThemeContext';
import { ViewModeProvider } from "@/context/ViewModeContext";
import { StoreProvider } from '@/context/StoreContext';
import MainLayoutWrapper from '@/components/layout/MainLayoutWrapper';

export const metadata: Metadata = {
  title: "Khush Enterprises - Scientific Laboratory Equipment",
  description: "One stop solution for high quality laboratory equipment and general supplies.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <ViewModeProvider>
          <ThemeProvider>
            <StoreProvider>
              <MainLayoutWrapper>
                {children}
              </MainLayoutWrapper>
            </StoreProvider>
          </ThemeProvider>
        </ViewModeProvider>
      </body>
    </html>
  );
}
