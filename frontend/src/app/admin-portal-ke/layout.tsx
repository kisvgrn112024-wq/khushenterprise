"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  let router: ReturnType<typeof useRouter> | null = null;
  let pathname: string | null = null;
  
  try {
    router = useRouter();
    pathname = usePathname();
  } catch (e) {
    // useRouter/usePathname may fail during static export - that's OK
  }

  useEffect(() => {
    if (!router || !pathname) {
      setIsMounted(true);
      return;
    }

    // B2B subroutes are public-facing and bypass admin master auth
    if (pathname.startsWith("/admin-portal-ke/b2b")) {
      setIsAuthenticated(true);
      setIsMounted(true);
      return;
    }

    // Basic Client-Side Auth Check
    const authStatus = localStorage.getItem("ke_admin_auth");
    let isValid = false;
    if (authStatus) {
      try {
        const parsed = JSON.parse(authStatus);
        const expiry = 7 * 24 * 60 * 60 * 1000; // 7 days session
        if (parsed.authenticated && (Date.now() - parsed.timestamp < expiry)) {
          isValid = true;
        }
      } catch (e) {
        // invalid session format
      }
    }

    if (isValid) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("ke_admin_auth");
      setIsAuthenticated(false);
      // Redirect unauthenticated admin access to secure login page
      router.replace("/secure-portal-access");
    }
    setIsMounted(true);
  }, [pathname, router]);

  // During static export, show content; on client, apply auth
  if (!isMounted) {
    return <div className="h-screen bg-theme flex items-center justify-center text-neon-cyan">Initializing...</div>;
  }

  if (!router || !pathname) {
    // Static export mode - show content without auth
    return <AdminLayout>{children}</AdminLayout>;
  }

  if (pathname.startsWith("/admin-portal-ke/b2b")) {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return <div className="h-screen bg-theme flex items-center justify-center text-neon-cyan">Verifying Access...</div>;
  }

  return isAuthenticated ? <AdminLayout>{children}</AdminLayout> : null;
}
