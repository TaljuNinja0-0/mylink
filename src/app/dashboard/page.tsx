"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  onSnapshot 
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, ExternalLink, Trash2, Loader2, Pencil, LogIn, Lock } from "lucide-react";
import { AddLinkDialog } from "@/components/dashboard/AddLinkDialog";
import { DashboardLinkItem } from "@/components/dashboard/DashboardLinkItem";
import { type LinkItem } from "@/data/links";

export default function Dashboard() {
  const { user, loading: authLoading, logout, login } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempBio, setTempBio] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch profile and links
  useEffect(() => {
    if (authLoading || !user) return;

    const fetchProfile = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(data);
        setTempName(data.username || data.displayName || "");
        setTempBio(data.bio || "");
      }
    };

    fetchProfile();

    // Fetch links
    const linksRef = collection(db, "users", user.uid, "links");
    const q = query(linksRef, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLinks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LinkItem[];
      setLinks(fetchedLinks);
      setDataLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  const updateProfile = async (field: string, value: string) => {
    if (!user) return;
    setIsUpdating(true);
    const docRef = doc(db, "users", user.uid);
    try {
      await updateDoc(docRef, { 
        [field]: value,
        updatedAt: serverTimestamp()
      });
      setProfile((prev: any) => ({ ...prev, [field]: value }));
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const addLink = async (title: string, url: string) => {
    if (!user) return;
    setIsUpdating(true);
    try {
      await addDoc(collection(db, "users", user.uid, "links"), {
        title,
        url,
        clickCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Add link failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateLink = async (id: string, title: string, url: string) => {
    if (!user) return;
    setIsUpdating(true);
    try {
      const linkRef = doc(db, "users", user.uid, "links", id);
      await updateDoc(linkRef, {
        title,
        url,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Update link failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteLink = async (id: string) => {
    if (!user) return;
    setIsUpdating(true);
    try {
      await deleteDoc(doc(db, "users", user.uid, "links", id));
    } catch (error) {
      console.error("Delete link failed:", error);
    } finally {
      setIsUpdating(false);
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
        <div className="mb-6 rounded-full bg-primary/10 p-6 text-primary">
          <Lock className="h-12 w-12" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-gray-900">로그인이 필요한 서비스입니다</h2>
        <p className="mb-8 max-w-md text-muted-foreground leading-relaxed">
          MyLink의 대시보드를 이용하려면 로그인이 필요합니다.<br />
          지금 로그인하고 나만의 링크 페이지를 만들어보세요!
        </p>
        <Button size="lg" onClick={login} className="font-bold shadow-lg shadow-primary/20 px-8">
          <LogIn className="mr-2 h-5 w-5" />
          Google로 로그인하기
        </Button>
      </div>
    );
  }

  if (!profile && dataLoading) {
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
        <header className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">내 대시보드</h2>
          <Button 
            variant="outline" 
            size="sm" 
            className="shadow-sm"
            onClick={() => window.open(`/${profile?.username || user.uid}`, "_blank")}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            내 페이지 보기
          </Button>
        </header>

        {/* Profile Card */}
        <div className="rounded-3xl border-none bg-white p-8 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-50" />
          <div className="relative flex flex-col items-center space-y-5">
            <div className="relative">
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-blue-400 rounded-full blur-md opacity-25 group-hover:opacity-50 transition-opacity" />
              <img
                src={profile?.photoURL || user.photoURL || "https://github.com/shadcn.png"}
                alt="Profile"
                referrerPolicy="no-referrer"
                className="relative h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
              />
            </div>
            
            <div className="w-full space-y-4 text-center">
              <div className="space-y-1">
                {isEditingName ? (
                  <Input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => {
                      setIsEditingName(false);
                      updateProfile("username", tempName);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setIsEditingName(false);
                        updateProfile("username", tempName);
                      }
                    }}
                    autoFocus
                    disabled={isUpdating}
                    className="mx-auto max-w-xs text-center text-2xl font-bold bg-gray-50/50"
                  />
                ) : (
                  <h2
                    onClick={() => !isUpdating && setIsEditingName(true)}
                    className={`cursor-pointer text-2xl font-extrabold hover:text-primary transition-colors group inline-flex items-center gap-2 ${isUpdating ? "opacity-70" : ""}`}
                  >
                    {profile?.username || "이름 설정"} 
                    <span className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all text-sm translate-x-1">✎</span>
                  </h2>
                )}
                <p className="text-sm text-muted-foreground font-medium tracking-wide">{user.email}</p>
              </div>

              <div className="text-base">
                {isEditingBio ? (
                  <Input
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    onBlur={() => {
                      setIsEditingBio(false);
                      updateProfile("bio", tempBio);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setIsEditingBio(false);
                        updateProfile("bio", tempBio);
                      }
                    }}
                    autoFocus
                    disabled={isUpdating}
                    placeholder="자기소개를 입력해주세요..."
                    className="mx-auto max-w-md text-center bg-gray-50/50"
                  />
                ) : (
                  <p
                    onClick={() => !isUpdating && setIsEditingBio(true)}
                    className={`cursor-pointer text-muted-foreground leading-relaxed hover:text-primary transition-colors group flex items-center justify-center gap-1.5 ${isUpdating ? "opacity-70" : ""}`}
                  >
                    {profile?.bio || "자기소개를 추가해보세요..."} 
                    <span className="opacity-0 group-hover:opacity-100 transition-all text-xs">✎</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="space-y-6 pb-20">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold tracking-tight">링크 관리</h3>
            <AddLinkDialog onAdd={addLink} isLoading={isUpdating} />
          </div>
          
          <div className="space-y-4">
            {dataLoading ? (
              <div className="flex h-32 items-center justify-center rounded-2xl border bg-white/50 shadow-inner">
                <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
              </div>
            ) : links.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-3xl border-2 border-dashed bg-white/50 text-muted-foreground shadow-inner">
                등록된 링크가 없습니다. "링크 추가하기"를 클릭해 보세요.
              </div>
            ) : (
              links.map((link) => (
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
        </div>
      </main>
    </div>
  );
}
