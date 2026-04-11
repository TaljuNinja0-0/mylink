"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const { user, login, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="mb-4 text-5xl font-bold">MyLink</h1>
      <p className="mb-8 text-xl text-muted-foreground">
        Share all your links in one place. Simple, fast, and free.
      </p>

      {user ? (
        <div className="flex flex-col gap-4">
          <p className="text-lg">Welcome, {user.displayName}!</p>
          <Link href="/dashboard">
            <Button size="lg" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      ) : (
        <Button size="lg" onClick={login}>
          Sign in with Google
        </Button>
      )}
    </main>
  );
}
