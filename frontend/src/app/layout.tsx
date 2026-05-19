import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/shared/ChatWidget";
import { StoreProvider } from "@/context/StoreContext";
import CartDrawer from "@/components/store/CartDrawer";

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
      <body className="antialiased bg-background text-foreground font-sans">
          <StoreProvider>
            <Header />
            {children}
            <Footer />
            <ChatWidget />
            <CartDrawer />
          </StoreProvider>
      </body>
    </html>
  );
}
