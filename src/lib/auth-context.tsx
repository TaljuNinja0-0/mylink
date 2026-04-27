"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User 
} from "firebase/auth";
import { auth, googleProvider, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /* 실제 Firebase 인증 상태 감시 주석 처리
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          const emailPrefix = firebaseUser.email?.split("@")[0] || "";
          await setDoc(userDocRef, {
            displayName: firebaseUser.displayName || emailPrefix,
            email: firebaseUser.email,
            bio: "",
            photoURL: firebaseUser.photoURL || "",
            createdAt: new Date(),
          });
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
    */
    setLoading(false); // 초기 로딩 상태 즉시 해제
  }, []);

  const login = async () => {
    try {
      // 구글 소셜 로그인 주석 처리
      // await signInWithPopup(auth, googleProvider);
      
      // 테스트를 위한 Mock 로그인
      setUser({
        uid: "anonymous-user",
        displayName: "테스터",
        email: "tester@example.com",
        photoURL: "https://github.com/shadcn.png"
      } as any);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      // await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
