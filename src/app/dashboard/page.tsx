"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, getDocs, addDoc, deleteDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, ExternalLink, Trash2, Loader2, Pencil } from "lucide-react";
import { AddLinkDialog } from "@/components/dashboard/AddLinkDialog";
import { DashboardLinkItem } from "@/components/dashboard/DashboardLinkItem";
import { dummyLinks, type LinkItem } from "@/data/links";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempBio, setTempBio] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Local links state
  const [links, setLinks] = useState<LinkItem[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchProfile() {
      // 익명 테스트를 위해 고정된 'anonymous' 문서 사용
      const docRef = doc(db, "users", "anonymous");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(data);
        setTempName(data.username || data.displayName || "Anonymous");
        setTempBio(data.bio || "");
      } else {
        // 문서가 없으면 기본값 설정
        const defaultProfile = {
          username: "Anonymous Tester",
          displayName: "Anonymous",
          email: "anonymous@test.com",
          photoURL: "https://github.com/shadcn.png",
          bio: "Firebase 테스트 중"
        };
        setProfile(defaultProfile);
        setTempName(defaultProfile.username);
        setTempBio(defaultProfile.bio);
      }
    }
    fetchProfile();
  }, []);

  const fetchLinks = async () => {
    try {
      const linksRef = collection(db, "users", "anonymous", "links");
      const q = query(linksRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const fetchedLinks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LinkItem[];
      setLinks(fetchedLinks);
    } catch (error) {
      console.error("Error fetching links:", error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLinks();
  }, []);

  const updateProfile = async (field: string, value: string) => {
    setIsUpdating(true);
    const docRef = doc(db, "users", "anonymous");
    try {
      await updateDoc(docRef, { [field]: value });
      setProfile((prev: any) => ({ ...prev, [field]: value }));
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const addLink = async (title: string, url: string) => {
    setIsUpdating(true);
    try {
      await addDoc(collection(db, "users", "anonymous", "links"), {
        title,
        url,
        clickCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await fetchLinks(); // 갱신형: 작업 후 목록 다시 불러오기
    } catch (error) {
      console.error("Add link failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateLink = async (id: string, title: string, url: string) => {
    setIsUpdating(true);
    try {
      const linkRef = doc(db, "users", "anonymous", "links", id);
      await updateDoc(linkRef, {
        title,
        url,
        updatedAt: serverTimestamp(),
      });
      await fetchLinks(); // 갱신형: 작업 후 목록 다시 불러오기
    } catch (error) {
      console.error("Update link failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteLink = async (id: string) => {
    setIsUpdating(true);
    try {
      await deleteDoc(doc(db, "users", "anonymous", "links", id));
      await fetchLinks(); // 갱신형: 작업 후 목록 다시 불러오기
    } catch (error) {
      console.error("Delete link failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading || !user || !profile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">대시보드를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans relative">
      {/* Global Updating Loader */}
      {isUpdating && (
        <div className="fixed top-0 left-0 w-full h-1 z-50 overflow-hidden bg-primary/10">
          <div className="h-full bg-primary animate-progress origin-left w-full" />
        </div>
      )}
      
      <header className="mx-auto mb-8 flex max-w-2xl items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-primary">MyLink</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.open(`/${profile.displayName}`, "_blank")}>
            <ExternalLink className="mr-2 h-4 w-4" />
            페이지 보기
          </Button>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-8">
        {/* Profile Card */}
        <div className="rounded-2xl border-none bg-white p-8 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-50" />
          <div className="relative flex flex-col items-center space-y-5">
            <div className="relative">
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-blue-400 rounded-full blur-md opacity-25 group-hover:opacity-50 transition-opacity" />
              <img
                src={profile.photoURL}
                alt="Profile"
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
                    {profile.username || "Set Name"} 
                    <span className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all text-sm translate-x-1">✎</span>
                  </h2>
                )}
                <p className="text-sm text-muted-foreground font-medium tracking-wide">{profile.email}</p>
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
                    placeholder="Short bio..."
                    className="mx-auto max-w-md text-center bg-gray-50/50"
                  />
                ) : (
                  <p
                    onClick={() => !isUpdating && setIsEditingBio(true)}
                    className={`cursor-pointer text-muted-foreground leading-relaxed hover:text-primary transition-colors group flex items-center justify-center gap-1.5 ${isUpdating ? "opacity-70" : ""}`}
                  >
                    {profile.bio || "Add a short bio..."} 
                    <span className="opacity-0 group-hover:opacity-100 transition-all text-xs">✎</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold tracking-tight">내 링크 관리</h3>
            <AddLinkDialog onAdd={addLink} isLoading={isUpdating} />
          </div>
          
          <div className="space-y-4">
            {links.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed bg-white/50 text-muted-foreground shadow-inner">
                등록된 링크가 없습니다. "링크 추가하기" 버튼을 눌러 시작해보세요.
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
