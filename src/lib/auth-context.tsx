"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
/*
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User 
} from "firebase/auth";
import { auth, googleProvider, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
*/

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로컬 개발을 위한 Mock 로그인 상태 시뮬레이션
    const timer = setTimeout(() => {
      setUser({
        uid: "dummy-user-id",
        displayName: "테스터",
        email: "tester@example.com",
        photoURL: "https://github.com/shadcn.png"
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);

    /*
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          const emailPrefix = user.email?.split("@")[0] || "";
          await setDoc(userDocRef, {
            displayName: emailPrefix,
            username: user.displayName || emailPrefix,
            email: user.email,
            bio: "",
            photoURL: user.photoURL || "",
            createdAt: new Date(),
          });
        }
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
    */
  }, []);

  const login = async () => {
    // Mock Login
    setUser({
      uid: "dummy-user-id",
      displayName: "테스터",
      email: "tester@example.com",
      photoURL: "https://github.com/shadcn.png"
    });
  };

  const logout = async () => {
    // Mock Logout
    setUser(null);
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
