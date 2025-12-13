"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

type UserRole = "BIDDER" | "SELLER" | "ADMIN";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
  fallback?: ReactNode;
}

/**
 * Role-based Access Guard Component
 * Restricts access based on user role
 * Redirects or shows fallback if user doesn't have required role
 */
export function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/403",
  fallback,
}: RoleGuardProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && user && !allowedRoles.includes(user.role)) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, user, allowedRoles, redirectTo, router]);

  // If not authenticated or role not allowed
  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
