"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * Authentication Guard Component
 * Protects routes by checking if user is authenticated
 * Redirects to login page if not authenticated
 */
export function AuthGuard({
  children,
  redirectTo = "/dang-nhap",
  requireAuth = true,
}: AuthGuardProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, requireAuth, redirectTo, router]);

  // Don't render children if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
