import LinkList from "@/components/LinkList";

interface ProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params;
  
  // 익명 테스트를 위한 고정 프로필 정보
  const isAnonymousTest = true;
  const profileName = isAnonymousTest ? "Anonymous Tester" : resolvedParams.slug;
  const profileBio = isAnonymousTest ? "Firebase 연동 테스트 중입니다." : "Welcome to my links page!";

  return (
    <main className="flex min-h-screen flex-col items-center py-20 px-4 bg-background">
      <div className="mb-10 text-center w-full max-w-md">
        <div className="w-24 h-24 bg-linear-to-br from-primary/20 to-primary/10 rounded-full mx-auto mb-4 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-3xl shadow-inner">
          {profileName.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">@{profileName}</h1>
        <p className="text-muted-foreground mt-2">{profileBio}</p>
        {isAnonymousTest && (
          <div className="mt-4 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full inline-block border border-amber-200">
            익명 테스트 모드
          </div>
        )}
      </div>
      
      <LinkList />
    </main>
  );
}
