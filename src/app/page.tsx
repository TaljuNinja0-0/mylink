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
      <h1 className="mb-4 text-5xl font-bold tracking-tight text-primary">MyLink</h1>
      <p className="mb-8 text-xl text-muted-foreground max-w-md">
        당신의 모든 링크를 한곳에서 관리하고 공유하세요. 심플하고 빠르며 무료입니다.
      </p>

      {user ? (
        <div className="flex flex-col gap-4">
          <p className="text-lg font-medium">{user.displayName}님, 환영합니다!</p>
          <Link href="/dashboard">
            <Button size="lg" className="w-full font-bold shadow-lg">
              대시보드로 이동
            </Button>
          </Link>
        </div>
      ) : (
        <Button size="lg" onClick={login} className="font-bold shadow-lg">
          Google로 시작하기
        </Button>
      )}
    </main>
  );
}
