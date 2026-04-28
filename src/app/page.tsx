"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn, LayoutDashboard, Sparkles, Globe, Link as LinkIcon, Zap } from "lucide-react";

export default function Home() {
  const { user, login } = useAuth();

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="max-w-3xl space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-sm border border-border text-sm font-semibold text-primary animate-bounce">
          <Sparkles className="h-4 w-4" />
          <span>나만의 링크 트리를 1분 만에 만드세요</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          당신의 모든 링크를 <br />
          <span className="text-primary bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">한곳에서 관리하세요</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          MyLink는 복잡한 설정 없이 소셜 미디어, 포트폴리오, 프로젝트 링크를 <br className="hidden md:block" />
          아름다운 하나의 페이지로 통합해주는 가장 심플한 방법입니다.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          {user ? (
            <Button render={<Link href="/dashboard" className="w-full sm:w-auto" />} size="lg" className="w-full sm:w-auto font-bold shadow-xl shadow-primary/20 h-14 px-10 text-lg group">
              <LayoutDashboard className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              대시보드로 이동
            </Button>
          ) : (
            <Button 
              size="lg" 
              onClick={login} 
              className="w-full sm:w-auto font-bold shadow-xl shadow-primary/20 h-14 px-10 text-lg group"
            >
              <LogIn className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              Google로 시작하기
            </Button>
          )}
        </div>


      </div>
    </main>
  );
}
