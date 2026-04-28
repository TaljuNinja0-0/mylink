import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, updateDoc, collection, getDocs, query, orderBy, addDoc, deleteDoc, serverTimestamp, where, limit } from "firebase/firestore";
import { db } from "./firebase";
import { LinkItem } from "@/data/links";

export interface UserProfileData {
  uid: string;
  username?: string;
  displayName?: string;
  bio?: string;
  photoURL?: string;
  email?: string;
  [key: string]: any;
}

// --- Profile Queries ---

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async (): Promise<UserProfileData | null> => {
      if (!userId) return null;
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfileData;
      }
      return null;
    },
    enabled: !!userId,
  });
}

export function useProfileBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["profileBySlug", slug],
    queryFn: async (): Promise<UserProfileData | null> => {
      if (!slug) return null;
      
      const decodedSlug = decodeURIComponent(slug);
      const usersRef = collection(db, "users");
      
      // 슬러그는 구글 이메일의 @ 앞부분인 username을 의미하므로 username으로 검색
      let q = query(usersRef, where("username", "==", decodedSlug), limit(1));
      let querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        return {
          uid: querySnapshot.docs[0].id,
          ...userData
        } as UserProfileData;
      }
      return null;
    },
    enabled: !!slug,
  });
}

export function useUpdateProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ field, value }: { field: string; value: string }) => {
      if (!userId) throw new Error("No user ID");
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, {
        [field]: value,
        updatedAt: serverTimestamp(),
      });
      return { field, value };
    },
    onMutate: async ({ field, value }) => {
      await queryClient.cancelQueries({ queryKey: ["profile", userId] });
      const previousProfile = queryClient.getQueryData(["profile", userId]);
      
      queryClient.setQueryData(["profile", userId], (old: any) => ({
        ...old,
        [field]: value,
      }));

      return { previousProfile };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["profile", userId], context?.previousProfile);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}

// --- Links Queries ---

export function useLinks(userId: string | undefined) {
  return useQuery({
    queryKey: ["links", userId],
    queryFn: async () => {
      if (!userId) return [];
      const linksRef = collection(db, "users", userId, "links");
      const q = query(linksRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LinkItem[];
    },
    enabled: !!userId,
  });
}

export function useAddLink(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, url }: { title: string; url: string }) => {
      if (!userId) throw new Error("No user ID");
      const docRef = await addDoc(collection(db, "users", userId, "links"), {
        title,
        url,
        clickCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, title, url };
    },
    onMutate: async ({ title, url }) => {
      await queryClient.cancelQueries({ queryKey: ["links", userId] });
      const previousLinks = queryClient.getQueryData(["links", userId]);
      
      queryClient.setQueryData(["links", userId], (old: LinkItem[] = []) => [
        { id: Math.random().toString(), title, url, clickCount: 0, createdAt: new Date().toISOString() },
        ...old,
      ]);

      return { previousLinks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["links", userId], context?.previousLinks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links", userId] });
    },
  });
}

export function useUpdateLink(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, url }: { id: string; title: string; url: string }) => {
      if (!userId) throw new Error("No user ID");
      const linkRef = doc(db, "users", userId, "links", id);
      await updateDoc(linkRef, {
        title,
        url,
        updatedAt: serverTimestamp(),
      });
      return { id, title, url };
    },
    onMutate: async ({ id, title, url }) => {
      await queryClient.cancelQueries({ queryKey: ["links", userId] });
      const previousLinks = queryClient.getQueryData(["links", userId]);
      
      queryClient.setQueryData(["links", userId], (old: LinkItem[]) => 
        old?.map(link => link.id === id ? { ...link, title, url } : link)
      );

      return { previousLinks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["links", userId], context?.previousLinks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links", userId] });
    },
  });
}

export function useDeleteLink(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("No user ID");
      await deleteDoc(doc(db, "users", userId, "links", id));
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["links", userId] });
      const previousLinks = queryClient.getQueryData(["links", userId]);
      
      queryClient.setQueryData(["links", userId], (old: LinkItem[]) => 
        old?.filter(link => link.id !== id)
      );

      return { previousLinks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["links", userId], context?.previousLinks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links", userId] });
    },
  });
}
