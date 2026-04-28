"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { 
  useProfile, 
  useLinks, 
  useUpdateProfile, 
  useAddLink, 
  useUpdateLink, 
  useDeleteLink 
} from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LogOut, ExternalLink, Trash2, Loader2, Pencil, LogIn, Lock } from "lucide-react";
import { AddLinkDialog } from "@/components/dashboard/AddLinkDialog";
import { DashboardLinkItem } from "@/components/dashboard/DashboardLinkItem";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type LinkItem } from "@/data/links";

export default function Dashboard() {
  const { user, loading: authLoading, login } = useAuth();
  const router = useRouter();

  // Queries
  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.uid);
  const { data: links = [], isLoading: isLinksLoading } = useLinks(user?.uid);

  // Mutations
  const updateProfile = useUpdateProfile(user?.uid);
  const addLinkMutation = useAddLink(user?.uid);
  const updateLinkMutation = useUpdateLink(user?.uid);
  const deleteLinkMutation = useDeleteLink(user?.uid);

  // Local state for inline editing

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState("");
  
  // Custom loading state for duplications or other async inline logic
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  const isUpdating = updateProfile.isPending || addLinkMutation.isPending || updateLinkMutation.isPending || deleteLinkMutation.isPending || isCheckingDuplicate;
  const dataLoading = isProfileLoading || isLinksLoading;

  const handleInlineUpdate = async (field: string, newValue: string) => {
    if (!user) return;
    
    // 변경된 사항이 없으면 무시
    const oldValue = profile?.[field] || "";
    if (newValue === oldValue) {
      return;
    }

    // 유효성 검사 및 중복 검사
    if (field === "username") {
      if (newValue.length < 3) {
        alert("Username은 3자 이상이어야 합니다.");
        setTempUsername(oldValue);
        return;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(newValue)) {
        alert("Username은 영문자, 숫자, 언더스코어(_)만 사용 가능합니다.");
        setTempUsername(oldValue);
        return;
      }
      setIsCheckingDuplicate(true);
      try {
        const q = query(collection(db, "users"), where("username", "==", newValue));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.some(doc => doc.id !== user.uid)) {
          alert("이미 사용 중인 Username입니다.");
          setTempUsername(oldValue);
          return;
        }
      } finally {
        setIsCheckingDuplicate(false);
      }

    } else if (field === "bio") {
      if (newValue.length > 100) {
        alert("소개글은 100자 이내여야 합니다.");
        setTempBio(oldValue);
        return;
      }
    }

    try {
      await updateProfile.mutateAsync({ field, value: newValue });
    } catch (error) {
      console.error(`Profile update failed for ${field}:`, error);
      alert("업데이트 중 오류가 발생했습니다.");
    }
  };

  const addLink = async (title: string, url: string) => {
    try {
      await addLinkMutation.mutateAsync({ title, url });
    } catch (error) {
      console.error("Add link failed:", error);
    }
  };

  const updateLink = async (id: string, title: string, url: string) => {
    try {
      await updateLinkMutation.mutateAsync({ id, title, url });
    } catch (error) {
      console.error("Update link failed:", error);
    }
  };

  const deleteLink = async (id: string) => {
    try {
      await deleteLinkMutation.mutateAsync(id);
    } catch (error) {
      console.error("Delete link failed:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">로그인 상태를 확인 중입니다...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center p-6 text-center">
        <Card className="max-w-md p-8 border-border shadow-sm flex flex-col items-center">
          <div className="mb-6 rounded-full bg-muted p-6 text-foreground">
            <Lock className="h-12 w-12" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-foreground">로그인이 필요한 서비스입니다</h2>
          <p className="mb-8 text-muted-foreground leading-relaxed">
            MyLink의 대시보드를 이용하려면 로그인이 필요합니다.<br />
            지금 로그인하고 나만의 링크 페이지를 만들어보세요!
          </p>
          <Button size="lg" onClick={login} className="font-bold px-8 w-full">
            <LogIn className="mr-2 h-5 w-5" />
            Google로 로그인하기
          </Button>
        </Card>
      </div>
    );
  }

  if (dataLoading && !profile) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">사용자 데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans relative">
      {/* Global Updating Loader */}
      {isUpdating && (
        <div className="fixed top-0 left-0 w-full h-1 z-50 overflow-hidden bg-primary/10">
          <div className="h-full bg-primary animate-progress origin-left w-full" />
        </div>
      )}
      
      <main className="mx-auto max-w-2xl space-y-8">
        <Card className="p-8 relative overflow-hidden group shadow-sm border-border">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-50" />
          <div className="relative flex flex-col items-center space-y-5">
            <div className="relative">
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-blue-400 rounded-full blur-md opacity-25 group-hover:opacity-50 transition-opacity" />
              <img
                src={profile?.photoURL || user.photoURL || "https://github.com/shadcn.png"}
                alt="Profile"
                referrerPolicy="no-referrer"
                className="relative h-28 w-28 rounded-full border-4 border-background object-cover shadow-lg"
              />
            </div>
            
            <div className="w-full space-y-4 text-center">
              <div className="space-y-1">
                {/* Display Name */}
                <h2 className="text-2xl font-extrabold text-card-foreground inline-flex items-center gap-2">
                  {profile?.displayName || profile?.username || "이름 설정"} 
                </h2>

                {/* Username */}
                <div className="mt-1">
                  {isEditingUsername ? (
                    <Input
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      onBlur={() => {
                        setIsEditingUsername(false);
                        handleInlineUpdate("username", tempUsername);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setIsEditingUsername(false);
                          handleInlineUpdate("username", tempUsername);
                        }
                      }}
                      autoFocus
                      disabled={isUpdating}
                      className="mx-auto max-w-[200px] text-center text-sm font-medium text-primary bg-primary/5"
                    />
                  ) : (
                    <p 
                      onClick={() => {
                        if (!isUpdating) {
                          setTempUsername(profile?.username || "");
                          setIsEditingUsername(true);
                        }
                      }}
                      className={`cursor-pointer text-sm font-medium text-primary hover:text-primary/70 transition-colors group inline-flex items-center gap-1.5 ${isUpdating ? "opacity-70" : ""}`}
                    >
                      @{profile?.username || "username_설정"}
                      <span className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all text-xs">✎</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="text-base pt-2">
                {/* Bio */}
                {isEditingBio ? (
                  <Input
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    onBlur={() => {
                      setIsEditingBio(false);
                      handleInlineUpdate("bio", tempBio);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setIsEditingBio(false);
                        handleInlineUpdate("bio", tempBio);
                      }
                    }}
                    autoFocus
                    disabled={isUpdating}
                    placeholder="자기소개를 입력해주세요..."
                    className="mx-auto max-w-md text-center bg-muted text-foreground"
                  />
                ) : (
                  <p
                    onClick={() => {
                      if (!isUpdating) {
                        setTempBio(profile?.bio || "");
                        setIsEditingBio(true);
                      }
                    }}
                    className={`cursor-pointer text-muted-foreground leading-relaxed hover:text-primary transition-colors group flex items-center justify-center gap-1.5 ${isUpdating ? "opacity-70" : ""}`}
                  >
                    {profile?.bio || "자기소개를 추가해보세요..."} 
                    <span className="opacity-0 group-hover:opacity-100 transition-all text-xs">✎</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Links Section */}
        <div className="space-y-4 pb-20">
          <AddLinkDialog onAdd={addLink} isLoading={isUpdating} />
          
            {isLinksLoading ? (
              <div className="flex h-32 items-center justify-center rounded-lg border border-border bg-card/50 shadow-sm">
                <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
              </div>
            ) : links.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-card/50 text-muted-foreground shadow-sm">
                등록된 링크가 없습니다. "링크 추가하기"를 클릭해 보세요.
              </div>
            ) : (
              links.map((link: LinkItem) => (
                <DashboardLinkItem
                  key={link.id}
                  link={link}
                  onUpdate={updateLink}
                  onDelete={deleteLink}
                  isUpdating={isUpdating}
                />
              ))
            )}
        </div>
      </main>
    </div>
  );
}
