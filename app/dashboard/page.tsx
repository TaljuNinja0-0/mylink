"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, ExternalLink, Trash2 } from "lucide-react";
import { AddLinkDialog } from "@/components/dashboard/AddLinkDialog";
import { dummyLinks, type LinkItem } from "@/data/links";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempBio, setTempBio] = useState("");
  
  // Local links state with initial dummy data
  const [links, setLinks] = useState<LinkItem[]>(dummyLinks);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // 로컬 개발을 위한 더미 프로필 설정
    setProfile({
      username: "테스터",
      displayName: "tester",
      email: "tester@example.com",
      bio: "안녕하세요! MyLink 로컬 테스트 중입니다.",
      photoURL: "https://github.com/shadcn.png"
    });
    setTempName("테스터");
    setTempBio("안녕하세요! MyLink 로컬 테스트 중입니다.");

    /*
    async function fetchProfile() {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          setTempName(data.username);
          setTempBio(data.bio);
        }
      }
    }
    fetchProfile();
    */
  }, [user]);

  const updateProfile = async (field: string, value: string) => {
    // 로컬 상태만 업데이트
    setProfile((prev: any) => ({ ...prev, [field]: value }));
    
    /*
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    try {
      await updateDoc(docRef, { [field]: value });
      setProfile((prev: any) => ({ ...prev, [field]: value }));
    } catch (error) {
      console.error("Update failed:", error);
    }
    */
  };

  const addLink = (title: string, url: string) => {
    const newLink: LinkItem = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      url,
      clickCount: 0,
    };
    setLinks([newLink, ...links]);
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  if (loading || !user || !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <header className="mx-auto mb-8 flex max-w-2xl items-center justify-between">
        <h1 className="text-2xl font-bold">MyLink</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.open(`/${profile.displayName}`, "_blank")}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View Live
          </Button>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
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
                    className="mx-auto max-w-xs text-center text-2xl font-bold bg-gray-50/50"
                  />
                ) : (
                  <h2
                    onClick={() => setIsEditingName(true)}
                    className="cursor-pointer text-2xl font-extrabold hover:text-primary transition-colors group inline-flex items-center gap-2"
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
                    placeholder="Short bio..."
                    className="mx-auto max-w-md text-center bg-gray-50/50"
                  />
                ) : (
                  <p
                    onClick={() => setIsEditingBio(true)}
                    className="cursor-pointer text-muted-foreground leading-relaxed hover:text-primary transition-colors group flex items-center justify-center gap-1.5"
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
            <h3 className="text-xl font-bold tracking-tight">Your Links</h3>
            <AddLinkDialog onAdd={addLink} />
          </div>
          
          <div className="space-y-4">
            {links.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed bg-white/50 text-muted-foreground shadow-inner">
                No links yet. Click "Add New Link" to start.
              </div>
            ) : (
              links.map((link) => (
                <div 
                  key={link.id}
                  className="flex items-center gap-5 rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="bg-linear-to-br from-gray-50 to-gray-100 p-3 rounded-xl shrink-0 border border-gray-100 group-hover:scale-110 transition-transform">
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${(() => {
                        try { return new URL(link.url).hostname; } 
                        catch { return ""; }
                      })()}&sz=64`} 
                      alt="" 
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-lg truncate text-gray-900">{link.title}</h4>
                    <p className="text-sm text-muted-foreground truncate font-medium">{link.url}</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                    <Button 
                      variant="ghost" 
                      size="icon-sm" 
                      onClick={() => deleteLink(link.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full h-10 w-10"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
