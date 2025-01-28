"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) return <div>Ładowanie...</div>;
  if (!user) return null;

  return <>{children}</>;
}
