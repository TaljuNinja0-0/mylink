"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { type LinkItem } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LinkList() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
    
    fetchLinks();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">링크 불러오는 중...</p>
      </div>
    );
  }

  if (links.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">등록된 링크가 없습니다.</div>;
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md gap-4 mx-auto">
      {links.map((link) => (
        <a 
          key={link.id} 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] block group"
        >
          <Card className="cursor-pointer overflow-hidden border-none bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-md group-hover:shadow-[0_10px_25px_-5px_rgba(59,130,246,0.4)] transition-all duration-300">
            <CardContent className="p-5 flex items-center justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-1.5 rounded-lg shrink-0 border border-white/20 transition-transform group-hover:scale-110">
                <img 
                  src={`https://www.google.com/s2/favicons?domain=${(() => {
                    try { return new URL(link.url).hostname; } 
                    catch { return ""; }
                  })()}&sz=64`} 
                  alt="" 
                  className="w-7 h-7 object-contain brightness-110 contrast-110"
                />
              </div>
              <span className="font-bold text-lg tracking-tight truncate drop-shadow-sm">{link.title}</span>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}
