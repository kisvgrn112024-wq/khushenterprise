"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // B2B subroutes are public-facing and bypass admin master auth
    if (pathname.startsWith("/admin-portal-ke/b2b")) {
      setIsAuthenticated(true);
      return;
    }

    // Basic Client-Side Auth Check
    const authStatus = sessionStorage.getItem("ke_admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      // Stealth redirect: bounce guessing users to public homepage to mask portal existence
      router.replace("/");
    }
  }, [pathname, router]);

  if (pathname.startsWith("/admin-portal-ke/b2b")) {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return <div className="h-screen bg-[#050b14] flex items-center justify-center text-neon-cyan">Verifying Access...</div>;
  }

  return isAuthenticated ? <AdminLayout>{children}</AdminLayout> : null;
}
