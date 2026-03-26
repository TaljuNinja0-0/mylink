"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, ExternalLink } from "lucide-react";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempBio, setTempBio] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
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
  }, [user]);

  const updateProfile = async (field: string, value: string) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    try {
      await updateDoc(docRef, { [field]: value });
      setProfile((prev: any) => ({ ...prev, [field]: value }));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (loading || !user || !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
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
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center space-y-4">
            <img
              src={profile.photoURL}
              alt="Profile"
              className="h-24 w-24 rounded-full border-2 border-primary object-cover"
            />
            
            <div className="w-full space-y-4 text-center">
              {/* Username Inline Edit */}
              <div>
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
                    className="mx-auto max-w-xs text-center text-xl font-semibold"
                  />
                ) : (
                  <h2
                    onClick={() => setIsEditingName(true)}
                    className="cursor-pointer text-xl font-semibold hover:text-primary"
                  >
                    {profile.username || "Set Name"} ✎
                  </h2>
                )}
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>

              {/* Bio Inline Edit */}
              <div className="text-sm">
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
                    className="mx-auto max-w-md text-center"
                  />
                ) : (
                  <p
                    onClick={() => setIsEditingBio(true)}
                    className="cursor-pointer text-muted-foreground hover:text-primary"
                  >
                    {profile.bio || "Add a short bio..."} ✎
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Links Section Placeholder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Links</h3>
            <Button size="sm">Add New Link</Button>
          </div>
          <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed bg-white text-muted-foreground">
            No links yet. Click "Add New Link" to start.
          </div>
        </div>
      </main>
    </div>
  );
}
