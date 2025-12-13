"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

/**
 * Authenticated Layout Component
 * Wraps pages that require authentication with loading state
 * Shows loading spinner while checking authentication
 */
export function AuthenticatedLayout({
  children,
  redirectTo = "/dang-nhap",
}: AuthenticatedLayoutProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to check auth state
    const timer = setTimeout(() => {
      setIsChecking(false);
      if (!isAuthenticated) {
        router.push(redirectTo);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, redirectTo, router]);

  if (isChecking || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
