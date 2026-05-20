"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Basic Client-Side Auth Check
    const authStatus = sessionStorage.getItem("ke_admin_auth");
    if (authStatus === "true") {
      setTimeout(() => setIsAuthenticated(true), 0);
    } else {
      setTimeout(() => setIsAuthenticated(false), 0);
      if (pathname !== "/admin-portal-ke/login") {
        router.push("/admin-portal-ke/login");
      }
    }
  }, [pathname, router]);

  if (isAuthenticated === null) {
    return <div className="h-screen bg-[#050b14] flex items-center justify-center text-neon-cyan">Verifying Access...</div>;
  }

  if (pathname === "/admin-portal-ke/login" || pathname.startsWith("/admin-portal-ke/b2b")) {
    return <>{children}</>;
  }

  return isAuthenticated ? <AdminLayout>{children}</AdminLayout> : null;
}
