"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LogIn, LayoutDashboard, Sparkles, Globe, Link as LinkIcon, Zap } from "lucide-react";

export default function Home() {
  const { user, login } = useAuth();

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-6 text-center bg-gray-50/50">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="max-w-3xl space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 text-sm font-semibold text-primary animate-bounce">
          <Sparkles className="h-4 w-4" />
          <span>나만의 링크 트리를 1분 만에 만드세요</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
          당신의 모든 링크를 <br />
          <span className="text-primary bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">한곳에서 관리하세요</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          MyLink는 복잡한 설정 없이 소셜 미디어, 포트폴리오, 프로젝트 링크를 <br className="hidden md:block" />
          아름다운 하나의 페이지로 통합해주는 가장 심플한 방법입니다.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          {user ? (
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full font-bold shadow-xl shadow-primary/20 h-14 px-10 text-lg rounded-2xl group">
                <LayoutDashboard className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                대시보드로 이동
              </Button>
            </Link>
          ) : (
            <Button 
              size="lg" 
              onClick={login} 
              className="w-full sm:w-auto font-bold shadow-xl shadow-primary/20 h-14 px-10 text-lg rounded-2xl group"
            >
              <LogIn className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              Google로 시작하기
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20">
          {[
            { icon: Globe, title: "고유한 URL", desc: "나만의 아이디로 생성되는 페이지" },
            { icon: LinkIcon, title: "무제한 링크", desc: "원하는 만큼 링크를 추가하세요" },
            { icon: Zap, title: "실시간 반영", desc: "수정 즉시 페이지에 반영됩니다" },
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <feature.icon className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
