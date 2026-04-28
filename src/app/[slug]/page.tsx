"use client";

import { use } from "react";
import LinkList from "@/components/LinkList";
import { useProfileBySlug } from "@/lib/queries";
import { Loader2, UserX } from "lucide-react";

export default function UserProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: userProfile, isLoading: loading, isError: error } = useProfileBySlug(slug);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground font-medium">페이지를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 p-6 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-sm w-full">
          <UserX className="h-16 w-16 text-destructive mx-auto mb-4 opacity-20" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">사용자를 찾을 수 없습니다</h1>
          <p className="text-muted-foreground mb-6">해당 주소의 페이지가 존재하지 않거나 삭제되었습니다.</p>
          <a href="/">
            <button className="w-full py-3 px-6 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
              메인으로 돌아가기
            </button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center bg-gray-50 py-16 px-4">
      <div className="w-full max-w-md flex flex-col items-center text-center mb-10">
        <div className="relative mb-6">
          <div className="absolute -inset-1 bg-linear-to-r from-primary to-blue-400 rounded-full blur opacity-20" />
          <img
            src={userProfile.photoURL || "https://github.com/shadcn.png"}
            alt="Profile"
            referrerPolicy="no-referrer"
            className="relative h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl"
          />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{userProfile.displayName || userProfile.username}</h1>
        <p className="text-lg text-muted-foreground mt-3 font-medium px-4 leading-relaxed">
          {userProfile.bio || "반갑습니다! 저의 MyLink 페이지입니다."}
        </p>
      </div>

      <div className="w-full max-w-md">
        <LinkList uid={userProfile.uid} />
      </div>

      <footer className="mt-auto pt-20">
        <a href="/" className="group flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded-lg flex items-center justify-center font-bold text-gray-500 group-hover:bg-primary group-hover:text-white transition-all">
            M
          </div>
          <span className="font-bold text-gray-400 group-hover:text-primary transition-colors">MyLink</span>
        </a>
      </footer>
    </main>
  );
}
